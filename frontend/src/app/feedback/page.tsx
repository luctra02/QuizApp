// app/feedback/page.ts
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import useUser from "@/app/hooks/useUser";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    AlertCircle,
    Brain,
    TrendingUp,
    Clock,
    Award,
    Loader2,
} from "lucide-react";

interface Quiz {
    id: string;
    date: string;
    category: string;
    difficulty: string;
    score: number;
    totalQuestions: number;
    percentage: number;
}

interface QuizDB {
    id: string;
    date_taken: string;
    score: number;
    total_questions: number;
    category: { name: string } | null;
    difficulty: { name: string } | null;
}

export default function AIFeedbackSelectionPage() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [generatingFeedback, setGeneratingFeedback] = useState<string | null>(
        null
    );
    const { data: user, isLoading: userLoading } = useUser();
    const supabase = createSupabaseBrowser();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            fetchQuizzes();
        } else if (!userLoading) {
            setIsLoading(false);
        }
    }, [user, userLoading]);

    const fetchQuizzes = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from("quizzes")
                .select(
                    `
          id, 
          date_taken, 
          score, 
          total_questions, 
          category:category_id(name), 
          difficulty:difficulty_id(name)
        `
                )
                .eq("user_id", user.id)
                .order("date_taken", { ascending: false });

            if (error || !data) {
                throw new Error("Failed to fetch quiz data");
            }

            const formattedQuizzes: Quiz[] = data.map((quiz: QuizDB) => ({
                id: quiz.id,
                date: new Date(quiz.date_taken).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                category: quiz.category?.name ?? "Unknown",
                difficulty: quiz.difficulty?.name ?? "Unknown",
                score: quiz.score,
                totalQuestions: quiz.total_questions,
                percentage: Math.round(
                    (quiz.score / quiz.total_questions) * 100
                ),
            }));

            setQuizzes(formattedQuizzes);
        } catch (err: unknown) {
            setError(
                err instanceof Error ? err.message : "An unknown error occurred"
            );
            console.error("Error fetching quizzes:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGetFeedback = async (quizId: string) => {
        setGeneratingFeedback(quizId);
        router.push(`/feedback/${quizId}`);
    };

    const getDifficultyVariant = (
        difficulty: string
    ): "secondary" | "default" | "destructive" | "outline" => {
        switch (difficulty?.toLowerCase()) {
            case "easy":
                return "secondary";
            case "medium":
                return "default";
            case "hard":
                return "destructive";
            default:
                return "outline";
        }
    };

    const getScoreColor = (percentage: number) => {
        if (percentage >= 80) return "text-green-600";
        if (percentage >= 60) return "text-yellow-600";
        return "text-red-600";
    };

    const getPerformanceIcon = (percentage: number) => {
        if (percentage >= 90) return "🌟";
        if (percentage >= 80) return "🎉";
        if (percentage >= 70) return "👍";
        if (percentage >= 60) return "👌";
        return "💪";
    };

    // Loading state
    if (userLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-slate-900/80 backdrop-blur-md border-purple-500/30">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-12 w-12 animate-spin text-purple-400 mb-4" />
                        <CardTitle className="text-xl text-white mb-2">
                            Loading Your Quizzes
                        </CardTitle>
                        <CardDescription className="text-blue-200 text-center">
                            Please wait while we fetch your quiz history...
                        </CardDescription>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Not authenticated
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-slate-900/80 backdrop-blur-md border-purple-500/30">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="text-4xl mb-4">🔒</div>
                        <CardTitle className="text-xl text-white mb-2">
                            Authentication Required
                        </CardTitle>
                        <CardDescription className="text-blue-200 text-center mb-6">
                            Please log in to access AI feedback for your
                            quizzes.
                        </CardDescription>
                        <div className="flex gap-4">
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
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-slate-900/80 backdrop-blur-md border-purple-500/30">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
                        <CardTitle className="text-xl text-red-400 mb-2">
                            Error
                        </CardTitle>
                        <CardDescription className="text-blue-200 text-center mb-4">
                            {error}
                        </CardDescription>
                        <Button
                            onClick={fetchQuizzes}
                            variant="outline"
                            className="border-blue-400 text-blue-400 hover:bg-blue-400/10"
                        >
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // No quizzes available
    if (quizzes.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-slate-900/80 backdrop-blur-md border-purple-500/30">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="text-4xl mb-4">📊</div>
                        <CardTitle className="text-xl text-white mb-2">
                            No Quizzes Found
                        </CardTitle>
                        <CardDescription className="text-blue-200 text-center mb-6">
                            You haven&apos;t taken any quizzes yet. Take a quiz
                            first to get AI feedback!
                        </CardDescription>
                        <Button
                            onClick={() => router.push("/quiz")}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                            Take a Quiz
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4">
                <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 mb-8">
                    <CardHeader className="text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Brain className="h-8 w-8 text-purple-400" />
                            <CardTitle className="text-3xl font-bold text-white">
                                AI Feedback
                            </CardTitle>
                        </div>
                        <CardDescription className="text-blue-200 text-lg">
                            Select a quiz to get personalized AI-powered
                            feedback and insights
                        </CardDescription>
                    </CardHeader>
                </Card>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {quizzes.map((quiz) => (
                        <Card
                            key={quiz.id}
                            className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 hover:border-purple-400/50 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25"
                        >
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg text-white mb-2">
                                            {quiz.category}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 text-sm text-blue-300 mb-2">
                                            <Clock className="h-4 w-4" />
                                            {quiz.date}
                                        </div>
                                        <Badge
                                            variant={getDifficultyVariant(
                                                quiz.difficulty
                                            )}
                                            className="text-xs"
                                        >
                                            {quiz.difficulty}
                                        </Badge>
                                    </div>
                                    <div className="text-2xl">
                                        {getPerformanceIcon(quiz.percentage)}
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-0">
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-blue-300 flex items-center gap-1">
                                                <Award className="h-4 w-4" />
                                                Score
                                            </span>
                                            <span
                                                className={`text-lg font-bold ${getScoreColor(quiz.percentage)}`}
                                            >
                                                {quiz.score}/
                                                {quiz.totalQuestions}
                                            </span>
                                        </div>
                                        <Progress
                                            value={quiz.percentage}
                                            className="h-2 bg-slate-700"
                                        />
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-xs text-blue-300">
                                                Performance
                                            </span>
                                            <span
                                                className={`text-sm font-medium ${getScoreColor(quiz.percentage)}`}
                                            >
                                                {quiz.percentage}%
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() =>
                                            handleGetFeedback(quiz.id)
                                        }
                                        disabled={
                                            generatingFeedback === quiz.id
                                        }
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                        size="sm"
                                    >
                                        {generatingFeedback === quiz.id ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Generating...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Brain className="h-4 w-4" />
                                                Get AI Feedback
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 mt-8">
                    <CardContent className="flex justify-center gap-4 py-6">
                        <Button
                            onClick={() => router.push("/quiz")}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Take Another Quiz
                        </Button>
                        <Button
                            onClick={() => router.push("/dashboard")}
                            variant="outline"
                            className="border-blue-400 text-blue-400 hover:bg-blue-400/10"
                        >
                            Back to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
