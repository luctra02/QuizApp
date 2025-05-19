"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import useUser from "@/app/hooks/useUser";

type QuizHistoryItem = {
    id: string;
    date: string;
    category: string;
    difficulty: string;
    score: number;
    totalQuestions: number;
};

export default function HistoryPage() {
    const [history, setHistory] = useState<QuizHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { data: user, isLoading: userLoading } = useUser();
    const supabase = createSupabaseBrowser();
    const router = useRouter();

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);

            if (!user) {
                setHistory([]);
                setIsLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("quizzes")
                .select(
                    "id, date_taken, score, total_questions, category:category_id(name), difficulty:difficulty_id(name)"
                )
                .eq("user_id", user.id)
                .order("date_taken", { ascending: false });

            console.log("Fetched quiz history:", data);

            if (error) {
                console.error("Error fetching history:", error);
                setIsLoading(false);
                return;
            }

            const parsedHistory: QuizHistoryItem[] = data.map((quiz) => ({
                id: quiz.id,
                date: new Date(quiz.date_taken).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
                category: quiz.category?.name ?? "Unknown",
                difficulty: quiz.difficulty?.name ?? "Unknown",
                score: quiz.score,
                totalQuestions: quiz.total_questions,
            }));

            setHistory(parsedHistory);
            setIsLoading(false);
        };

        fetchHistory();
    }, [supabase, user]);

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
        }
    };

    const getScoreClass = (score: number, total: number) => {
        const percentage = (score / total) * 100;
        if (percentage >= 80) return "text-green-400";
        if (percentage >= 60) return "text-yellow-400";
        return "text-red-400";
    };

    // Render appropriate content based on authentication state
    const renderContent = () => {
        // If user is still loading, show spinner
        if (userLoading) {
            return (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            );
        }

        // If no user is logged in, show login prompt
        if (!user) {
            return (
                <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-8 rounded-xl shadow-2xl text-white text-center">
                    <div className="flex flex-col items-center justify-center py-12">
                        <span className="text-5xl mb-4">🔒</span>
                        <h2 className="text-2xl font-bold text-blue-300 mb-2">
                            Authentication Required
                        </h2>
                        <p className="text-blue-200 mb-6">
                            Please log in to view your quiz history.
                        </p>
                        <div className="flex space-x-4">
                            <Button
                                onClick={() =>
                                    (window.location.href = "/login")
                                }
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                Log In
                            </Button>
                            <Button
                                onClick={() =>
                                    (window.location.href = "/register")
                                }
                                variant="outline"
                                className="border-blue-400 text-blue-400 hover:bg-blue-400/10"
                            >
                                Register
                            </Button>
                        </div>
                    </div>
                </Card>
            );
        }

        // If user is logged in but data is loading, show loading spinner
        if (isLoading) {
            return (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            );
        }

        // If user has no quiz history
        if (history.length === 0) {
            return (
                <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-8 rounded-xl shadow-2xl text-white text-center">
                    <div className="flex flex-col items-center justify-center py-12">
                        <span className="text-5xl mb-4">🔍</span>
                        <h2 className="text-2xl font-bold text-blue-300 mb-2">
                            No Quiz History Found
                        </h2>
                        <p className="text-blue-200 mb-6">
                            You haven&apos;t taken any quizzes yet.
                        </p>
                        <Button
                            onClick={() => (window.location.href = "/start")}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                            Take a Quiz
                        </Button>
                    </div>
                </Card>
            );
        }

        // If user has quiz history, display it
        return (
            <div className="grid gap-4">
                {history.map((item) => (
                    <Card
                        key={item.id}
                        className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-5 rounded-xl shadow-lg text-white hover:border-purple-400/50 transition-colors cursor-pointer"
                        onClick={() => router.push(`/review/${item.id}`)}
                    >
                        <div className="flex flex-col md:flex-row justify-between">
                            <div className="flex-1">
                                <p className="text-sm text-blue-300">
                                    {item.date}
                                </p>
                                <h3 className="text-xl font-semibold mt-1">
                                    {item.category}
                                </h3>
                                <p
                                    className={`text-sm font-medium ${getDifficultyColor(item.difficulty)}`}
                                >
                                    {item.difficulty}
                                </p>
                            </div>

                            <div className="flex items-center mt-4 md:mt-0">
                                <div className="text-right">
                                    <p className="text-sm text-blue-300">
                                        Score
                                    </p>
                                    <p
                                        className={`text-2xl font-bold ${getScoreClass(item.score, item.totalQuestions)}`}
                                    >
                                        {item.score}/{item.totalQuestions}
                                    </p>
                                    <p className="text-xs text-blue-300">
                                        {Math.round(
                                            (item.score / item.totalQuestions) *
                                                100
                                        )}
                                        %
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 text-right">
                            <span className="text-xs text-blue-300 flex items-center justify-end">
                                View Details {'>'}
                            </span>
                        </div>
                    </Card>
                ))}
            </div>
        );
    };

    return (
        <main className="min-h-screen flex flex-col items-center p-6 pt-24">
            <div className="w-full max-w-4xl">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center">
                            <span className="mr-3 text-blue-400">📜</span>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                                Quiz History
                            </span>
                        </h1>
                        <p className="text-blue-200">
                            Your previous quiz attempts and scores
                        </p>
                    </div>
                </div>

                {renderContent()}
            </div>
        </main>
    );
}
