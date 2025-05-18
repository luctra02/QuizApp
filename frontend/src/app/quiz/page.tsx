"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import useUser from "@/app/hooks/useUser";

type Question = {
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
    type: string;
    question_id?: string; // Optional for upsert
    category: string;
    difficulty: string;
    question_text: string;
};

export default function QuizPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const { data: user } = useUser();
    const supabase = createSupabaseBrowser();

    useEffect(() => {
        if (questions.length > 0) {
            setLoading(false);
            return;
        }

        const buildURL = () => {
            const params = new URLSearchParams();
            // Use the amount parameter from the URL or default to 10
            const amount = searchParams.get("amount") ?? "10";
            params.set("amount", amount);
            params.set("encode", "base64"); // Helps prevent HTML entities

            const category = searchParams.get("category") ?? "0";
            if (category !== "0") params.set("category", category);

            const difficulty = searchParams.get("difficulty") ?? "0";
            if (difficulty === "1") params.set("difficulty", "easy");
            else if (difficulty === "2") params.set("difficulty", "medium");
            else if (difficulty === "3") params.set("difficulty", "hard");

            const type = searchParams.get("type") ?? "0";
            if (type !== "0") params.set("type", type);

            const url = `https://opentdb.com/api.php?${params.toString()}`;
            return url;
        };

        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const res = await fetch(buildURL());
                const data = await res.json();

                if (data.response_code === 0 && data.results.length > 0) {
                    const capitalize = (s: string) =>
                        s.charAt(0).toUpperCase() + s.slice(1);

                    const decodedQuestions = data.results.map(
                        (q: Question) => ({
                            ...q,
                            question: atob(q.question),
                            correct_answer: atob(q.correct_answer),
                            incorrect_answers: q.incorrect_answers.map(
                                (a: string) => atob(a)
                            ),
                            category: atob(q.category), // ← decode this
                            difficulty: capitalize(atob(q.difficulty)), // ← and this
                            type: atob(q.type), // ← and this
                        })
                    );

                    // Upsert each question into your DB
                    if (user?.id) {
                        const finalQuestions: Question[] = [];
                        const { data: categoriesTable } = await supabase
                            .from("categories")
                            .select("*");
                        const { data: difficultiesTable } = await supabase
                            .from("difficulties")
                            .select("*");

                        const getCategoryId = (name: string) => {
                            return categoriesTable?.find((c) => c.name === name)
                                ?.id;
                        };

                        const getDifficultyId = (name: string) => {
                            return difficultiesTable?.find(
                                (d) => d.name === name
                            )?.id;
                        };

                        for (const q of decodedQuestions) {
                            const { data, error } = await supabase
                                .from("questions")
                                .select("id")
                                .eq("question_text", q.question) // Use question_text column here
                                .limit(1);

                            const existingQuestion = data?.[0];

                            if (!existingQuestion) {
                                const categoryId = getCategoryId(q.category);
                                const difficultyId = getDifficultyId(
                                    q.difficulty
                                );

                                const { data: inserted, error: insertError } =
                                    await supabase
                                        .from("questions")
                                        .insert({
                                            question_text: q.question,
                                            category_id: categoryId,
                                            difficulty_id: difficultyId,
                                            type: q.type,
                                            correct_answer: q.correct_answer,
                                        })
                                        .select("id") // Return the inserted ID
                                        .single();

                                const {
                                    data: incorrectAnswers,
                                    error: incorrectAnswersError,
                                } = await supabase
                                    .from("incorrect_answers")
                                    .insert(
                                        q.incorrect_answers.map(
                                            (answer: string) => ({
                                                question_id: inserted?.id,
                                                answer_text: answer,
                                            })
                                        )
                                    )
                                    .select("id");

                                finalQuestions.push({
                                    ...q,
                                    question_id: inserted?.id,
                                });
                                if (insertError)
                                    console.error(
                                        "Insert question error:",
                                        insertError
                                    );
                            } else {
                                finalQuestions.push({
                                    ...q,
                                    question_id: existingQuestion.id,
                                });
                            }
                        }
                        setQuestions(finalQuestions);
                    } else {
                        setQuestions(decodedQuestions);
                    }
                } else {
                    setError("No questions found. Try different settings.");
                }
            } catch (err) {
                console.error("Error fetching questions:", err);
                setError("Failed to fetch questions. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [questions.length, searchParams, supabase, user?.id]);

    const handleAnswerSelect = async (answer: string) => {
        if (selectedAnswer) return;

        setSelectedAnswer(answer);

        const isCorrect = answer === currentQuestion?.correct_answer;
        const updatedScore = isCorrect ? score + 1 : score;

        if (isCorrect) {
            setScore(updatedScore); // updates the state, but we also store it locally
        }

        setShowResult(true);

        if (user?.id) {
            const quizId = searchParams.get("quizId");
            const { error } = await supabase.from("quiz_questions").insert({
                quiz_id: quizId,
                question_id: currentQuestion.question_id,
                user_answer: answer,
                is_correct: isCorrect,
            });

            if (error) {
                console.error("Failed to save quiz question:", error);
            }
        }

        setTimeout(async () => {
            if (current < questions.length - 1) {
                setCurrent(current + 1);
                setSelectedAnswer(null);
                setShowResult(false);
            } else {
                if (user?.id) {
                    const quizId = searchParams.get("quizId");
                    console.log("Final score:", updatedScore);

                    const { error } = await supabase
                        .from("quizzes")
                        .update({ score: updatedScore })
                        .eq("id", quizId)
                        .eq("user_id", user.id)
                        .select();

                    if (error) {
                        console.error("Failed to update quiz score:", error);
                    }
                }

                console.log("Final score:", updatedScore);
                setQuizCompleted(true);
            }
        }, 1500);
    };

    const restartQuiz = async () => {
        if (user?.id) {
            const originalQuizId = searchParams.get("quizId");

            // 1. Get the original quiz to extract category_id, difficulty_id, and other settings
            const { data: originalQuiz, error: fetchError } = await supabase
                .from("quizzes")
                .select("category_id, difficulty_id, total_questions")
                .eq("id", originalQuizId)
                .eq("user_id", user.id)
                .single();

            if (fetchError || !originalQuiz) {
                console.error("Failed to fetch original quiz:", fetchError);
                return;
            }

            // 2. Create a new quiz with the same settings
            const { data: newQuiz, error: insertError } = await supabase
                .from("quizzes")
                .insert({
                    user_id: user.id,
                    category_id: originalQuiz.category_id,
                    difficulty_id: originalQuiz.difficulty_id,
                    score: 0,
                    total_questions: originalQuiz.total_questions,
                })
                .select("id")
                .single();

            if (insertError || !newQuiz) {
                console.error("Failed to create new quiz:", insertError);
                return;
            }

            // 3. Update URL with new quizId, but keep same parameters
            const params = new URLSearchParams(searchParams);
            params.set("quizId", newQuiz.id);

            // Reset the quiz state
            setCurrent(0);
            setScore(0);
            setSelectedAnswer(null);
            setShowResult(false);
            setQuizCompleted(false);
            setLoading(true);

            // Navigate to new quiz with same parameters
            router.replace(`/quiz?${params.toString()}`);
        } else {
            // For non-logged in users, simply reset the state
            setCurrent(0);
            setScore(0);
            setSelectedAnswer(null);
            setShowResult(false);
            setQuizCompleted(false);
            setLoading(true);
        }
    };

    const goToHome = () => {
        router.push("/start");
    };

    if (loading || questions.length === 0) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center p-6">
                <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-8 rounded-xl shadow-2xl w-full max-w-md text-white text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <span className="text-4xl">🧠</span>
                        <h2 className="text-2xl font-bold text-blue-300">
                            Loading Quiz...
                        </h2>
                        <div className="w-full max-w-md">
                            <div className="relative pt-1">
                                <div className="h-2 bg-blue-900 rounded-full overflow-hidden">
                                    <div className="w-1/2 h-full bg-blue-400 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </main>
        );
    }

    if (quizCompleted) {
        const percentage = Math.round((score / questions.length) * 100);
        let emoji, message;

        if (percentage >= 90) {
            emoji = "🏆";
            message = "Outstanding! You're a quiz master!";
        } else if (percentage >= 70) {
            emoji = "🌟";
            message = "Great job! You know your stuff!";
        } else if (percentage >= 50) {
            emoji = "👍";
            message = "Good effort! Keep learning!";
        } else {
            emoji = "📚";
            message = "Keep practicing! You'll get better!";
        }

        return (
            <main className="min-h-screen flex flex-col items-center justify-center p-6">
                <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-8 rounded-xl shadow-2xl w-full max-w-md text-white">
                    <div className="flex flex-col items-center justify-center text-center">
                        <span className="text-5xl mb-4">{emoji}</span>
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                            Quiz Completed!
                        </h2>
                        <p className="text-xl text-blue-200 mb-6">{message}</p>

                        <div className="w-full bg-slate-800 rounded-full h-4 mb-6">
                            <div
                                className="h-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>

                        <div className="text-2xl font-bold mb-8">
                            <span className="text-blue-300">Your Score: </span>
                            <span className="text-white">
                                {score}/{questions.length}
                            </span>
                            <span className="text-sm text-blue-300 ml-2">
                                ({percentage}%)
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full">
                            <Button
                                onClick={restartQuiz}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                            >
                                Try Again
                            </Button>
                            <Button
                                onClick={goToHome}
                                className="flex-1 bg-gradient-to-r from-slate-600 to-slate-800 hover:from-slate-700 hover:to-slate-900 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                            >
                                New Quiz
                            </Button>
                        </div>
                    </div>
                </Card>
            </main>
        );
    }

    const currentQuestion = questions[current];
    // Shuffle answers consistently
    const allAnswers = [
        ...currentQuestion.incorrect_answers,
        currentQuestion.correct_answer,
    ].sort();
    const progressPercentage = (current / questions.length) * 100;

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-6">
            <div className="text-center mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center justify-center">
                    <span className="mr-3 text-blue-400">🧠</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        QuizMaster
                    </span>
                </h1>
            </div>

            <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-6 rounded-xl shadow-2xl w-full max-w-xl text-white">
                <div className="mb-6">
                    <div className="flex justify-between mb-2">
                        <span className="text-blue-300">Progress</span>
                        <span className="text-blue-300">
                            {current + 1}/{questions.length}
                        </span>
                    </div>
                    <Progress
                        value={progressPercentage}
                        className="h-2 bg-slate-700"
                    >
                        <div className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
                    </Progress>
                </div>

                <div className="relative mb-6">
                    <span className="absolute -top-4 -left-2 text-2xl opacity-50">
                        ❓
                    </span>
                    <div className="bg-slate-800/50 p-4 pt-5 rounded-lg backdrop-blur-sm">
                        <p className="text-xl font-bold text-blue-100">
                            {currentQuestion.question}
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    {allAnswers.map((answer, i) => {
                        let buttonClass =
                            "w-full text-left py-3 px-4 rounded-lg transition-all duration-200 ";

                        if (showResult && selectedAnswer) {
                            if (answer === currentQuestion.correct_answer) {
                                buttonClass +=
                                    "bg-green-600/40 border-2 border-green-500 text-white";
                            } else if (answer === selectedAnswer) {
                                buttonClass +=
                                    "bg-red-600/40 border-2 border-red-500 text-white";
                            } else {
                                buttonClass += "bg-slate-800/30 text-slate-400";
                            }
                        } else {
                            buttonClass += selectedAnswer
                                ? "bg-slate-800/30 text-slate-400 cursor-not-allowed"
                                : "bg-slate-800 hover:bg-slate-700 text-white";
                        }

                        return (
                            <button
                                key={i}
                                className={buttonClass}
                                onClick={() => handleAnswerSelect(answer)}
                                disabled={!!selectedAnswer}
                            >
                                <div className="flex items-center">
                                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-300 mr-3">
                                        {String.fromCharCode(65 + i)}
                                    </span>
                                    <span>{answer}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-8 flex justify-between items-center">
                    <div className="text-blue-300">
                        Score: {score}/{current}
                    </div>
                </div>
            </Card>
        </main>
    );
}
