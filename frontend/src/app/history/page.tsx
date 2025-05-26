"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import useUser from "@/app/hooks/useUser";
import {
    LoadingState,
    AuthRequired,
    EmptyState,
    PageContainer,
    PageHeader,
} from "@/components/ui";
import { Database } from "@/types/supabase";

type QuizRow = Database["public"]["Tables"]["quizzes"]["Row"];
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
type DifficultyRow = Database["public"]["Tables"]["difficulties"]["Row"];

type SupabaseQuizData = Omit<QuizRow, "category_id" | "difficulty_id"> & {
    category: Pick<CategoryRow, "name"> | null;
    difficulty: Pick<DifficultyRow, "name"> | null;
};

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

            if (error) {
                console.error("Error fetching history:", error);
                setIsLoading(false);
                return;
            }

            const parsedHistory: QuizHistoryItem[] = (
                data as unknown as SupabaseQuizData[]
            ).map((quiz) => ({
                id: quiz.id,
                date: new Date(quiz.date_taken ?? "").toLocaleDateString("en-US", {
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
        if (!difficulty) return "text-blue-400";

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

    // If user is still loading, show spinner
    if (userLoading) {
        return (
            <PageContainer maxWidth="4xl">
                <LoadingState
                    title="Loading"
                    description="Please wait..."
                    size="md"
                />
            </PageContainer>
        );
    }

    // If no user is logged in, show login prompt
    if (!user) {
        return (
            <PageContainer maxWidth="4xl">
                <AuthRequired
                    title="Authentication Required"
                    description="Please log in to view your quiz history."
                    showRegister={true}
                />
            </PageContainer>
        );
    }

    // If user is logged in but data is loading, show loading spinner
    if (isLoading) {
        return (
            <PageContainer maxWidth="4xl">
                <LoadingState
                    title="Loading Quiz History"
                    description="Please wait while we fetch your quiz history..."
                    size="lg"
                />
            </PageContainer>
        );
    }

    // If user has no quiz history
    if (history.length === 0) {
        return (
            <PageContainer maxWidth="4xl">
                <EmptyState
                    title="No Quiz History Found"
                    description="You haven't taken any quizzes yet."
                    icon="🔍"
                    actionText="Take a Quiz"
                    actionPath="/start"
                />
            </PageContainer>
        );
    }

    return (
        <PageContainer maxWidth="4xl">
            <PageHeader
                title="Quiz History"
                description="Your previous quiz attempts and scores"
                icon="📜"
            />

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
                                View Details {">"}
                            </span>
                        </div>
                    </Card>
                ))}
            </div>
        </PageContainer>
    );
}
