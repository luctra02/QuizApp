"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import useUser from "@/app/hooks/useUser";

// Type definitions
type QuizDetail = {
    id: string;
    date: string;
    category: string;
    difficulty: string;
    score: number;
    totalQuestions: number;
};

type QuestionReview = {
    id: string;
    questionText: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    type: string;
};

export default function QuizReviewPage() {
    const router = useRouter();
    const [quiz, setQuiz] = useState<QuizDetail | null>(null);
    const [questions, setQuestions] = useState<QuestionReview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { data: user, isLoading: userLoading } = useUser();
    const supabase = createSupabaseBrowser();
    const { quiz_id } = useParams() as { quiz_id: string };

    useEffect(() => {
        if (userLoading || !user || !quiz_id) return;

        let isMounted = true;

        const fetchQuizDetails = async () => {
            try {
                setIsLoading(true);

                // Fetch quiz metadata
                const { data: quizData, error: quizError } = await supabase
                    .from("quizzes")
                    .select(
                        "id, date_taken, score, total_questions, category:category_id(name), difficulty:difficulty_id(name), user_id"
                    )
                    .eq("id", quiz_id)
                    .single();

                if (quizError || !quizData) {
                    if (isMounted) {
                        setError("Error fetching quiz data");
                        setIsLoading(false);
                    }
                    return;
                }

                const quizDetail: QuizDetail = {
                    id: quizData.id,
                    date: new Date(quizData.date_taken).toLocaleString(),
                    category: quizData.category?.name ?? "Unknown",
                    difficulty: quizData.difficulty?.name ?? "Unknown",
                    score: quizData.score,
                    totalQuestions: quizData.total_questions,
                };

                // Fetch all quiz_questions
                const { data: quizQuestions, error: questionsError } =
                    await supabase
                        .from("quiz_questions")
                        .select("question_id, user_answer, is_correct")
                        .eq("quiz_id", quiz_id);

                if (
                    questionsError ||
                    !quizQuestions ||
                    quizQuestions.length === 0
                ) {
                    if (isMounted) {
                        setError("Error fetching quiz questions");
                        setIsLoading(false);
                    }
                    return;
                }

                // Get all related question_ids
                const questionIds = quizQuestions.map((q) => q.question_id);

                // Fetch all question details in one go
                const { data: questionsData, error: questionsFetchError } =
                    await supabase
                        .from("questions")
                        .select("id, question_text, correct_answer, type")
                        .in("id", questionIds);

                if (questionsFetchError || !questionsData) {
                    if (isMounted) {
                        setError("Error fetching question data");
                        setIsLoading(false);
                    }
                    return;
                }

                // Map them together
                const questionResults: QuestionReview[] = quizQuestions
                    .map((q) => {
                        const question = questionsData.find(
                            (qd) => qd.id === q.question_id
                        );
                        return question
                            ? {
                                  id: q.question_id,
                                  questionText: question.question_text,
                                  userAnswer: q.user_answer,
                                  correctAnswer: question.correct_answer,
                                  isCorrect: q.is_correct,
                                  type: question.type,
                              }
                            : null;
                    })
                    .filter(Boolean) as QuestionReview[];

                if (isMounted) {
                    setQuiz(quizDetail);
                    setQuestions(questionResults);
                    setIsLoading(false);
                }
            } catch (err) {
                console.error("Unexpected error:", err);
                if (isMounted) {
                    setError("Unexpected error occurred");
                    setIsLoading(false);
                }
            }
        };

        fetchQuizDetails();
        return () => {
            isMounted = false;
        };
    }, [user, userLoading, quiz_id, supabase, router]);

    // Render appropriate content based on authentication and loading states
    const renderContent = () => {
        // If user is still loading
        if (userLoading) {
            return renderLoadingState();
        }

        // If no user is logged in
        if (!user) {
            return renderLoginPrompt();
        }

        // If data is loading
        if (isLoading) {
            return renderLoadingState();
        }

        // If there was an error
        if (error) {
            return renderErrorState();
        }

        // If quiz not found
        if (!quiz) {
            return renderQuizNotFound();
        }

        // Render the quiz review
        return renderQuizReview();
    };

    const renderLoadingState = () => (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
    );

    const renderErrorState = () => (
        <Card className="bg-slate-900/80 backdrop-blur-md border-red-500/30 border p-8 rounded-xl shadow-2xl text-white text-center">
            <div className="flex flex-col items-center justify-center py-12">
                <span className="text-5xl mb-4">⚠️</span>
                <h2 className="text-2xl font-bold text-red-300 mb-2">
                    Error Loading Quiz
                </h2>
                <p className="text-blue-200 mb-6">
                    {error || "There was a problem loading this quiz."}
                </p>
                <Button
                    onClick={() => router.push("/history")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                    Back to History
                </Button>
            </div>
        </Card>
    );

    const renderLoginPrompt = () => (
        <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-8 rounded-xl shadow-2xl text-white text-center">
            <div className="flex flex-col items-center justify-center py-12">
                <span className="text-5xl mb-4">🔒</span>
                <h2 className="text-2xl font-bold text-blue-300 mb-2">
                    Authentication Required
                </h2>
                <p className="text-blue-200 mb-6">
                    Please log in to view quiz details.
                </p>
                <div className="flex space-x-4">
                    <Button
                        onClick={() => router.push("/login")}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                        Log In
                    </Button>
                    <Button
                        onClick={() => router.push("/register")}
                        variant="outline"
                        className="border-blue-400 text-blue-400 hover:bg-blue-400/10"
                    >
                        Register
                    </Button>
                </div>
            </div>
        </Card>
    );

    const renderQuizNotFound = () => (
        <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-8 rounded-xl shadow-2xl text-white text-center">
            <div className="flex flex-col items-center justify-center py-12">
                <span className="text-5xl mb-4">❓</span>
                <h2 className="text-2xl font-bold text-blue-300 mb-2">
                    Quiz Not Found
                </h2>
                <p className="text-blue-200 mb-6">
                    We couldn&apos;t find the quiz you&apos;re looking for.
                </p>
                <Button
                    onClick={() => router.push("/history")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                    Back to History
                </Button>
            </div>
        </Card>
    );

    const renderQuizReview = () => {
        if (!quiz) return null;

        const percentage = Math.round((quiz.score / quiz.totalQuestions) * 100);

        return (
            <>
                {/* Quiz Summary Card */}
                <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-6 rounded-xl shadow-lg text-white mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start">
                        <div>
                            <p className="text-sm text-blue-300">{quiz.date}</p>
                            <h2 className="text-2xl font-bold mt-1">
                                {quiz.category}
                            </h2>
                            <p
                                className={`mt-1 text-sm font-medium ${getDifficultyColor(quiz.difficulty)}`}
                            >
                                {quiz.difficulty}
                            </p>
                        </div>

                        <div className="mt-4 md:mt-0 text-right">
                            <p className="text-sm text-blue-300">
                                Overall Score
                            </p>
                            <p
                                className={`text-3xl font-bold ${getScoreClass(quiz.score, quiz.totalQuestions)}`}
                            >
                                {quiz.score}/{quiz.totalQuestions}
                            </p>
                            <p className="text-xs text-blue-300">
                                {percentage}%
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Questions Review */}
                <div className="mb-4">
                    <h3 className="text-xl font-semibold text-white mb-4">
                        Question Review
                    </h3>
                </div>

                {questions.length > 0 ? (
                    questions.map((question, index) => (
                        <Card
                            key={question.id}
                            className={`mb-4 border p-6 rounded-xl shadow-md ${
                                question.isCorrect
                                    ? "bg-green-900/30 border-green-500/30"
                                    : "bg-red-900/30 border-red-500/30"
                            }`}
                        >
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mr-4">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            question.isCorrect
                                                ? "bg-green-500 text-white"
                                                : "bg-red-500 text-white"
                                        }`}
                                    >
                                        {question.isCorrect ? "✓" : "✗"}
                                    </div>
                                </div>

                                <div className="flex-grow">
                                    <p className="text-lg font-medium text-white mb-3">
                                        {index + 1}. {question.questionText}
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* User's Answer */}
                                        <div className="bg-slate-800/50 p-4 rounded-lg">
                                            <p className="text-sm text-blue-300 mb-1">
                                                Your Answer:
                                            </p>
                                            <p
                                                className={`font-medium ${question.isCorrect ? "text-green-400" : "text-red-400"}`}
                                            >
                                                {question.userAnswer}
                                            </p>
                                        </div>

                                        {/* Correct Answer */}
                                        <div className="bg-slate-800/50 p-4 rounded-lg">
                                            <p className="text-sm text-blue-300 mb-1">
                                                Correct Answer:
                                            </p>
                                            <p className="font-medium text-green-400">
                                                {question.correctAnswer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-8 text-blue-300">
                        No questions found for this quiz.
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between mt-8">
                    <Button
                        onClick={() => router.push("/history")}
                        variant="outline"
                        className="border-blue-400 text-blue-400 hover:bg-blue-400/10"
                    >
                        Back to History
                    </Button>

                    <Button
                        onClick={() => router.push("/start")}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                        Take Another Quiz
                    </Button>
                </div>
            </>
        );
    };

    const getDifficultyColor = (difficulty?: string) => {
        if (!difficulty) return "text-blue-400"; // default color

        switch (difficulty.toLowerCase()) {
            case "easy":
                return "text-green-400";
            case "medium":
                return "text-yellow-400";
            case "hard":
                return "text-red-400";
            case "any difficulty":
                return "text-blue-400";
            default:
                return "text-blue-400";
        }
    };

    const getScoreClass = (score: number, total: number) => {
        const percentage = (score / total) * 100;
        if (percentage >= 80) return "text-green-400";
        if (percentage >= 60) return "text-yellow-400";
        return "text-red-400";
    };

    return (
        <main className="min-h-screen flex flex-col items-center p-6 pt-24">
            <div className="w-full max-w-4xl">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center">
                            <span className="mr-3 text-blue-400">📝</span>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                                Quiz Review
                            </span>
                        </h1>
                        <p className="text-blue-200">
                            Review your answers and see where you went wrong
                        </p>
                    </div>
                </div>

                {renderContent()}
            </div>
        </main>
    );
}
