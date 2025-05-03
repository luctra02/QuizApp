"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

    useEffect(() => {
        // In a real app, fetch data from localStorage or an API
        setIsLoading(true);

        // Simulate loading data
        setTimeout(() => {
            // Example data - in a real app, this would come from localStorage or an API
            const mockData: QuizHistoryItem[] = [
                {
                    id: "1",
                    date: "May 3, 2025",
                    category: "Science",
                    difficulty: "Medium",
                    score: 8,
                    totalQuestions: 10,
                },
                {
                    id: "2",
                    date: "May 2, 2025",
                    category: "History",
                    difficulty: "Hard",
                    score: 6,
                    totalQuestions: 10,
                },
                {
                    id: "3",
                    date: "April 29, 2025",
                    category: "Sports",
                    difficulty: "Easy",
                    score: 9,
                    totalQuestions: 10,
                },
                {
                    id: "4",
                    date: "April 27, 2025",
                    category: "Entertainment",
                    difficulty: "Medium",
                    score: 7,
                    totalQuestions: 10,
                },
            ];

            setHistory(mockData);
            setIsLoading(false);
        }, 1000);
    }, []);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case "easy":
                return "text-green-400";
            case "medium":
                return "text-yellow-400";
            case "hard":
                return "text-red-400";
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

    const clearHistory = () => {
        // In a real app, clear localStorage or make API call
        setHistory([]);
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

                    {history.length > 0 && (
                        <Button
                            onClick={clearHistory}
                            className="mt-4 md:mt-0 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30"
                        >
                            Clear History
                        </Button>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : history.length === 0 ? (
                    <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-8 rounded-xl shadow-2xl text-white text-center">
                        <div className="flex flex-col items-center justify-center py-12">
                            <span className="text-5xl mb-4">🔍</span>
                            <h2 className="text-2xl font-bold text-blue-300 mb-2">
                                No Quiz History Found
                            </h2>
                            <p className="text-blue-200 mb-6">
                                You haven't taken any quizzes yet.
                            </p>
                            <Button
                                onClick={() => (window.location.href = "/")}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                Take a Quiz
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {history.map((item) => (
                            <Card
                                key={item.id}
                                className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-5 rounded-xl shadow-lg text-white"
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
                                                {item.score}/
                                                {item.totalQuestions}
                                            </p>
                                            <p className="text-xs text-blue-300">
                                                {Math.round(
                                                    (item.score /
                                                        item.totalQuestions) *
                                                        100
                                                )}
                                                %
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
