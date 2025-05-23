"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import useUser from "@/app/hooks/useUser";

export default function StatsPage() {
    const { data: user } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalQuizzes: 0,
        averageScore: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        categoryBreakdown: [] as { name: string; value: number }[],
        difficultyBreakdown: [] as { name: string; value: number }[],
        recentScores: [] as { date: string; score: number }[],
    });

    useEffect(() => {
        async function fetchStats() {
            if (!user) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            const supabase = createSupabaseBrowser();

            try {
                // Fetch user stats
                const { data: userStats, error: userStatsError } =
                    await supabase
                        .from("user_stats")
                        .select("*")
                        .eq("id", user.id)
                        .single();

                if (userStatsError) throw userStatsError;

                // Fetch quizzes for additional stats
                const { data: quizzes, error: quizzesError } = await supabase
                    .from("quizzes")
                    .select(
                        `
                        id, 
                        date_taken, 
                        score, 
                        total_questions,
                        categories(name),
                        difficulties(name)
                    `
                    )
                    .eq("user_id", user.id)
                    .order("date_taken", { ascending: false });

                if (quizzesError) throw quizzesError;

                // Calculate category breakdown
                const categoryCount: Record<string, number> = {};
                quizzes.forEach((quiz) => {
                    const categoryName = quiz.categories.name;
                    categoryCount[categoryName] =
                        (categoryCount[categoryName] || 0) + 1;
                });

                const categoryBreakdown = Object.keys(categoryCount).map(
                    (name) => ({
                        name,
                        value: categoryCount[name],
                    })
                );

                // Calculate difficulty breakdown
                const difficultyCount: Record<string, number> = {};
                quizzes.forEach((quiz) => {
                    const difficultyName = quiz.difficulties.name;
                    difficultyCount[difficultyName] =
                        (difficultyCount[difficultyName] || 0) + 1;
                });

                const difficultyBreakdown = Object.keys(difficultyCount).map(
                    (name) => ({
                        name,
                        value: difficultyCount[name],
                    })
                );

                // Calculate recent scores (last 5 quizzes)
                const recentScores = quizzes
                    .slice(0, 5)
                    .map((quiz) => {
                        const date = new Date(quiz.date_taken);
                        const formattedDate = `${date.toLocaleString("default", { month: "short" })} ${date.getDate()}`;
                        const scorePercentage = Math.round(
                            (quiz.score / quiz.total_questions) * 100
                        );

                        return {
                            date: formattedDate,
                            score: scorePercentage,
                        };
                    })
                    .reverse(); // Reverse to show oldest to newest

                // Calculate average score
                const averageScore =
                    userStats.total_questions > 0
                        ? Math.round(
                              (userStats.correct_answers /
                                  userStats.total_questions) *
                                  100
                          )
                        : 0;

                setStats({
                    totalQuizzes: userStats.total_quizzes,
                    averageScore: averageScore,
                    totalQuestions: userStats.total_questions,
                    correctAnswers: userStats.correct_answers,
                    categoryBreakdown,
                    difficultyBreakdown,
                    recentScores,
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
                // If there's an error, at least show empty stats
                setStats({
                    totalQuizzes: 0,
                    averageScore: 0,
                    totalQuestions: 0,
                    correctAnswers: 0,
                    categoryBreakdown: [],
                    difficultyBreakdown: [],
                    recentScores: [],
                });
            } finally {
                setIsLoading(false);
            }
        }

        fetchStats();
    }, [user]);

    const COLORS = ["#8b5cf6", "#6366f1", "#3b82f6", "#06b6d4", "#10b981"];
    const DIFFICULTY_COLORS: Record<string, string> = {
        Easy: "#10b981",
        Medium: "#f59e0b",
        Hard: "#ef4444",
    };

    // Loading state
    if (isLoading) {
        return (
            <main className="min-h-screen flex flex-col items-center p-6 pt-24">
                <div className="w-full max-w-4xl">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 flex items-center">
                        <span className="mr-3 text-blue-400">📊</span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            Your Statistics
                        </span>
                    </h1>

                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                </div>
            </main>
        );
    }

    // Not logged in state
    if (!user) {
        return (
            <main className="min-h-screen flex flex-col items-center p-6 pt-24">
                <div className="w-full max-w-4xl">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 flex items-center">
                        <span className="mr-3 text-blue-400">📊</span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            Statistics
                        </span>
                    </h1>

                    <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-8 rounded-xl shadow-2xl text-white text-center">
                        <div className="flex flex-col items-center justify-center py-12">
                            <span className="text-5xl mb-4">🔐</span>
                            <h2 className="text-2xl font-bold text-blue-300 mb-2">
                                Please Log In
                            </h2>
                            <p className="text-blue-200 mb-6">
                                You need to be logged in to view your
                                statistics.
                            </p>
                            <Button
                                onClick={() =>
                                    (window.location.href = "/login")
                                }
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                Log In
                            </Button>
                        </div>
                    </Card>
                </div>
            </main>
        );
    }

    // No stats available state
    if (stats.totalQuizzes === 0) {
        return (
            <main className="min-h-screen flex flex-col items-center p-6 pt-24">
                <div className="w-full max-w-4xl">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 flex items-center">
                        <span className="mr-3 text-blue-400">📊</span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            Your Statistics
                        </span>
                    </h1>

                    <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-8 rounded-xl shadow-2xl text-white text-center">
                        <div className="flex flex-col items-center justify-center py-12">
                            <span className="text-5xl mb-4">📈</span>
                            <h2 className="text-2xl font-bold text-blue-300 mb-2">
                                No Statistics Yet
                            </h2>
                            <p className="text-blue-200 mb-6">
                                Take some quizzes to generate statistics!
                            </p>
                            <Button
                                onClick={() =>
                                    (window.location.href = "/start")
                                }
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                Take a Quiz
                            </Button>
                        </div>
                    </Card>
                </div>
            </main>
        );
    }

    // Stats display
    return (
        <main className="min-h-screen flex flex-col items-center p-6 pt-24">
            <div className="w-full max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 flex items-center">
                    <span className="mr-3 text-blue-400">📊</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Your Statistics
                    </span>
                </h1>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-4 rounded-xl shadow-lg text-white text-center">
                        <p className="text-blue-300 text-sm">Total Quizzes</p>
                        <p className="text-3xl font-bold mt-1">
                            {stats.totalQuizzes}
                        </p>
                    </Card>

                    <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-4 rounded-xl shadow-lg text-white text-center">
                        <p className="text-blue-300 text-sm">Average Score</p>
                        <p className="text-3xl font-bold mt-1">
                            {stats.averageScore}%
                        </p>
                    </Card>

                    <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-4 rounded-xl shadow-lg text-white text-center">
                        <p className="text-blue-300 text-sm">Total Questions</p>
                        <p className="text-3xl font-bold mt-1">
                            {stats.totalQuestions}
                        </p>
                    </Card>

                    <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-4 rounded-xl shadow-lg text-white text-center">
                        <p className="text-blue-300 text-sm">Correct Answers</p>
                        <p className="text-3xl font-bold mt-1">
                            {stats.correctAnswers}
                        </p>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Category Breakdown */}
                    <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-6 rounded-xl shadow-lg text-white">
                        <h2 className="text-xl font-semibold mb-4">
                            Categories
                        </h2>
                        <div className="h-64 flex justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.categoryBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) =>
                                            `${name} ${(percent * 100).toFixed(0)}%`
                                        }
                                    >
                                        {stats.categoryBreakdown.map(
                                            (entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        COLORS[
                                                            index %
                                                                COLORS.length
                                                        ]
                                                    }
                                                />
                                            )
                                        )}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Difficulty Breakdown */}
                    <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-6 rounded-xl shadow-lg text-white">
                        <h2 className="text-xl font-semibold mb-4">
                            Difficulty Level
                        </h2>
                        <div className="h-64 flex justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.difficultyBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) =>
                                            `${name} ${(percent * 100).toFixed(0)}%`
                                        }
                                    >
                                        {stats.difficultyBreakdown.map(
                                            (entry) => (
                                                <Cell
                                                    key={`cell-${entry.name}`}
                                                    fill={
                                                        DIFFICULTY_COLORS[
                                                            entry.name
                                                        ]
                                                    }
                                                />
                                            )
                                        )}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Performance Over Time */}
                <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-6 rounded-xl shadow-lg text-white mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                        Recent Performance
                    </h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={stats.recentScores}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#1e293b"
                                />
                                <XAxis dataKey="date" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#0f172a",
                                        borderColor: "#475569",
                                    }}
                                    labelStyle={{ color: "#e2e8f0" }}
                                />
                                <Bar dataKey="score" fill="#8b5cf6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </main>
    );
}
