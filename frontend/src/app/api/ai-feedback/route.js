// app/api/ai-feedback/route.js
import { createSupabaseServer } from "@/lib/supabase/server";
import { InferenceClient } from "@huggingface/inference";
import { NextResponse } from "next/server";

const client = new InferenceClient(process.env.HUGGINGFACE_API_TOKEN);

export async function POST(request) {
    try {
        const { quizId } = await request.json();

        // Use the server client instead of browser client
        const supabase = await createSupabaseServer();

        // Fetch quiz data from database
        const { data: quizData, error: quizError } = await supabase
            .from("quizzes")
            .select(
                `
        id, date_taken, score, total_questions, 
        category:category_id(name), 
        difficulty:difficulty_id(name)
      `
            )
            .eq("id", quizId)
            .single();

        if (quizError || !quizData) {
            console.error("Quiz fetch error:", quizError);
            throw new Error("Quiz not found");
        }

        // Fetch quiz questions and answers
        const { data: quizQuestions, error: questionsError } = await supabase
            .from("quiz_questions")
            .select("question_id, user_answer, is_correct")
            .eq("quiz_id", quizId);

        if (questionsError || !quizQuestions) {
            console.error("Questions fetch error:", questionsError);
            throw new Error("Quiz questions not found");
        }

        // Get question details
        const questionIds = quizQuestions.map((q) => q.question_id);
        const { data: questionsData, error: questionsFetchError } =
            await supabase
                .from("questions")
                .select("id, question_text, correct_answer, type")
                .in("id", questionIds);

        if (questionsFetchError || !questionsData) {
            console.error("Question details fetch error:", questionsFetchError);
            throw new Error("Question details not found");
        }

        // Map questions with answers
        const questionResults = quizQuestions
            .map((q) => {
                const question = questionsData.find(
                    (qd) => qd.id === q.question_id
                );
                return question
                    ? {
                          questionText: question.question_text,
                          userAnswer: q.user_answer || "Not answered",
                          correctAnswer: question.correct_answer,
                          isCorrect: q.is_correct,
                          type: question.type,
                      }
                    : null;
            })
            .filter(Boolean);

        // Create a detailed prompt for the AI
        const prompt = `Please analyze this quiz performance and provide constructive feedback:
    
Quiz Results:
- Category: ${quizData.category?.name || "General"}
- Difficulty: ${quizData.difficulty?.name || "Unknown"}
- Score: ${quizData.score}/${quizData.total_questions}
- Percentage: ${Math.round((quizData.score / quizData.total_questions) * 100)}%
- Date Taken: ${new Date(quizData.date_taken).toLocaleDateString()}

Questions and Answers:
${questionResults
    .map(
        (q, index) => `
Question ${index + 1}: ${q.questionText}
Correct Answer: ${q.correctAnswer}
User Answer: ${q.userAnswer}
Result: ${q.isCorrect ? "Correct ✓" : "Incorrect ✗"}
Question Type: ${q.type}`
    )
    .join("\n")}

Please provide personalized feedback that includes:
1. Overall performance assessment for this ${quizData.category?.name || "quiz"} quiz
2. Specific areas where the user excelled
3. Areas that need improvement based on incorrect answers
4. Learning recommendations specific to the ${quizData.category?.name || "subject"} category
5. Tips for tackling ${quizData.difficulty?.name || "this difficulty"} level questions
6. Encouragement and suggested next steps

Keep the feedback constructive, encouraging, and actionable. Make it personal and specific to their performance.`;

        // Use the updated chatCompletion method
        const response = await client.chatCompletion({
            model: "meta-llama/Llama-3.1-8B-Instruct",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a helpful educational assistant that provides constructive feedback on quiz performance. Be encouraging, specific, and actionable in your responses.",
                },
                { role: "user", content: prompt },
            ],
            max_tokens: 500,
            temperature: 0.7,
        });

        return NextResponse.json({
            feedback: response.choices[0].message.content,
            quizData: {
                category: quizData.category?.name,
                difficulty: quizData.difficulty?.name,
                score: quizData.score,
                totalQuestions: quizData.total_questions,
                percentage: Math.round(
                    (quizData.score / quizData.total_questions) * 100
                ),
                dateTaken: quizData.date_taken,
            },
            success: true,
        });
    } catch (error) {
        console.error("AI Feedback Error:", error);

        // Provide more specific error handling
        if (error.message.includes("Model too busy")) {
            return NextResponse.json(
                {
                    message:
                        "AI service is currently busy. Please try again in a few moments.",
                    error: error.message,
                },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { message: "Failed to generate AI feedback", error: error.message },
            { status: 500 }
        );
    }
}
