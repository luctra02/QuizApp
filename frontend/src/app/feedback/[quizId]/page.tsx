"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuizData {
    category: string;
    difficulty: string;
    score: number;
    totalQuestions: number;
    percentage: number;
    dateTaken: string;
}

interface AIResponse {
    success: boolean;
    feedback?: string;
    quizData?: QuizData;
    message?: string;
}

export default function AIFeedbackPage() {
    const [feedback, setFeedback] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [quizData, setQuizData] = useState<QuizData | null>(null);

    const router = useRouter();
    const params = useParams();
    const quizIdParam = params?.quizId;
    const quizId = Array.isArray(quizIdParam) ? quizIdParam[0] : quizIdParam;

    useEffect(() => {
        if (quizId) {
            generateAIFeedback(quizId);
        }
    }, [quizId]);

    const generateAIFeedback = async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch("/api/ai-feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ quizId: id }),
            });

            const result: AIResponse = await response.json();

            if (result.success) {
                setFeedback(result.feedback ?? "");
                setQuizData(result.quizData ?? null);
            } else {
                setError(result.message ?? "Failed to generate feedback");
            }
        } catch (err) {
            setError("Failed to connect to AI service");
            console.error("AI Feedback Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty?.toLowerCase()) {
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

    const getScoreColor = (percentage: number) => {
        if (percentage >= 80) return "text-green-400";
        if (percentage >= 60) return "text-yellow-400";
        return "text-red-400";
    };

    if (!quizId) {
        return (
            <main className="min-h-screen flex flex-col items-center p-6 pt-24">
                <div className="w-full max-w-4xl">
                    <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 p-8 rounded-xl shadow-2xl text-white text-center">
                        <div className="text-red-400 text-4xl mb-4">⚠️</div>
                        <h2 className="text-xl font-semibold mb-2 text-red-400">
                            No Quiz Selected
                        </h2>
                        <p className="text-blue-200 mb-4">
                            Please select a quiz to get AI feedback.
                        </p>
                        <Button
                            onClick={() => router.push("/dashboard")}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                            Go to Dashboard
                        </Button>
                    </Card>
                </div>
            </main>
        );
    }

    if (loading) {
        return (
            <main className="min-h-screen flex flex-col items-center p-6 pt-24">
                <div className="w-full max-w-4xl">
                    <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 p-8 rounded-xl shadow-2xl text-white text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold mb-2">
                            Generating AI Feedback
                        </h2>
                        <p className="text-blue-200">
                            Please wait while we analyze your quiz
                            performance...
                        </p>
                    </Card>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen flex flex-col items-center p-6 pt-24">
                <div className="w-full max-w-4xl">
                    <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 p-8 rounded-xl shadow-2xl text-white text-center">
                        <div className="text-red-400 text-4xl mb-4">⚠️</div>
                        <h2 className="text-xl font-semibold mb-2 text-red-400">
                            Error
                        </h2>
                        <p className="text-blue-200 mb-4">{error}</p>
                        <Button
                            onClick={() => router.push("/start")}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                            Take Another Quiz
                        </Button>
                    </Card>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex flex-col items-center p-6 pt-24">
            <div className="w-full max-w-4xl">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center">
                            <span className="mr-3 text-purple-400">🤖</span>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                                AI Feedback
                            </span>
                        </h1>
                        <p className="text-blue-200">
                            Personalized insights and recommendations for your
                            quiz performance
                        </p>
                    </div>
                </div>

                <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 p-8 rounded-xl shadow-2xl text-white">
                    {quizData && (
                        <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-purple-500/20">
                            <h3 className="font-semibold mb-3 text-blue-300">
                                Quiz Summary
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <span className="text-blue-300">
                                        Category:
                                    </span>{" "}
                                    <span className="font-medium text-white">
                                        {quizData.category}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-blue-300">
                                        Difficulty:
                                    </span>{" "}
                                    <span
                                        className={`font-medium ${getDifficultyColor(quizData.difficulty)}`}
                                    >
                                        {quizData.difficulty}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-blue-300">
                                        Score:
                                    </span>{" "}
                                    <span
                                        className={`font-medium ${getScoreColor(quizData.percentage)}`}
                                    >
                                        {quizData.score}/
                                        {quizData.totalQuestions}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-blue-300">
                                        Percentage:
                                    </span>{" "}
                                    <span
                                        className={`font-medium ${getScoreColor(quizData.percentage)}`}
                                    >
                                        {quizData.percentage}%
                                    </span>
                                </div>
                            </div>
                            <div className="mt-2 text-sm">
                                <span className="text-blue-300">Date:</span>{" "}
                                <span className="font-medium text-white">
                                    {new Date(
                                        quizData.dateTaken
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 rounded-lg border border-blue-400/30">
                            <div className="flex items-start gap-3">
                                <div className="text-2xl">🤖</div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold mb-3 text-blue-300">
                                        AI-Generated Feedback
                                    </h3>
                                    <div className="text-white leading-relaxed whitespace-pre-wrap">
                                        {feedback}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center flex-wrap">
                        <Button
                            onClick={() => router.push("/start")}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                            Take Another Quiz
                        </Button>
                        <Button
                            onClick={() => router.push(`/review/${quizId}`)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                            View Detailed Results
                        </Button>
                    </div>
                </Card>
            </div>
        </main>
    );
}
