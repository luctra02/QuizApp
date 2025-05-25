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

            // Fix the type issue by properly typing the data from Supabase
            const formattedQuizzes: Quiz[] = (data as any[]).map((quiz) => ({
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
            <main className="min-h-screen flex flex-col items-center p-6 pt-24">
                <div className="w-full max-w-4xl mx-auto px-4">
                    <Card className="bg-slate-900/60 backdrop-blur-xl border-purple-500/20 rounded-2xl shadow-2xl text-white">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="h-16 w-16 animate-spin text-purple-400 mb-6" />
                            <CardTitle className="text-2xl text-white mb-3">
                                Loading Your Quizzes
                            </CardTitle>
                            <CardDescription className="text-slate-300 text-center text-lg">
                                Please wait while we fetch your quiz history...
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>
            </main>
        );
    }

    // Not authenticated
    if (!user) {
        return (
            <main className="min-h-screen flex flex-col items-center p-6 pt-24">
                <div className="w-full max-w-4xl mx-auto px-4">
                    <Card className="bg-slate-900/60 backdrop-blur-xl border-purple-500/20 rounded-2xl shadow-2xl text-white">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="text-6xl mb-6">🔒</div>
                            <CardTitle className="text-2xl text-white mb-3">
                                Authentication Required
                            </CardTitle>
                            <CardDescription className="text-slate-300 text-center text-lg mb-8">
                                Please log in to access AI feedback for your
                                quizzes.
                            </CardDescription>
                            <div className="flex gap-4">
                                <Button
                                    onClick={() => router.push("/login")}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 text-lg"
                                >
                                    Log In
                                </Button>
                                <Button
                                    onClick={() => router.push("/register")}
                                    variant="outline"
                                    className="border-purple-400/50 text-purple-300 hover:bg-purple-400/10 px-8 py-3 text-lg"
                                >
                                    Register
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        );
    }

    // Error state
    if (error) {
        return (
            <main className="min-h-screen flex flex-col items-center p-6 pt-24">
                <div className="w-full max-w-4xl mx-auto px-4">
                    <Card className="bg-slate-900/60 backdrop-blur-xl border-red-500/20 rounded-2xl shadow-2xl text-white">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <AlertCircle className="h-16 w-16 text-red-400 mb-6" />
                            <CardTitle className="text-2xl text-red-400 mb-3">
                                Error
                            </CardTitle>
                            <CardDescription className="text-slate-300 text-center text-lg mb-6">
                                {error}
                            </CardDescription>
                            <Button
                                onClick={fetchQuizzes}
                                variant="outline"
                                className="border-red-400/50 text-red-300 hover:bg-red-400/10 px-8 py-3"
                            >
                                Try Again
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        );
    }

    // No quizzes available
    if (quizzes.length === 0) {
        return (
            <main className="min-h-screen flex flex-col items-center p-6 pt-24">
                <div className="w-full max-w-4xl mx-auto px-4">
                    <Card className="bg-slate-900/60 backdrop-blur-xl border-purple-500/20 rounded-2xl shadow-2xl text-white">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="text-6xl mb-6">📊</div>
                            <CardTitle className="text-2xl text-white mb-3">
                                No Quizzes Found
                            </CardTitle>
                            <CardDescription className="text-slate-300 text-center text-lg mb-8">
                                You haven&apos;t taken any quizzes yet. Take a
                                quiz first to get AI feedback!
                            </CardDescription>
                            <Button
                                onClick={() => router.push("/start")}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 text-lg"
                            >
                                Take a Quiz
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen p-6 pt-24">
            <div className="w-full max-w-7xl mx-auto px-4">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center">
                        <span className="mr-4 text-5xl">🤖</span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                            AI Feedback
                        </span>
                    </h1>
                    <p className="text-slate-300 text-xl max-w-2xl mx-auto">
                        Select a quiz to get personalized AI-powered feedback
                        and insights
                    </p>
                </div>

                {/* Quiz Grid */}
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mb-12">
                    {quizzes.map((quiz) => (
                        <Card
                            key={quiz.id}
                            className="bg-slate-900/40 backdrop-blur-xl border-purple-500/20 rounded-2xl shadow-xl text-white hover:border-purple-400/40 hover:shadow-2xl transition-all duration-300 hover:scale-105"
                        >
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="text-xl text-white mb-3 font-semibold">
                                            {quiz.category}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 text-sm text-slate-300 mb-3">
                                            <Clock className="h-4 w-4 text-purple-400" />
                                            {quiz.date}
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={`${getDifficultyColor(quiz.difficulty)} border-current`}
                                        >
                                            {quiz.difficulty}
                                        </Badge>
                                    </div>
                                    <div className="text-3xl ml-4">
                                        {getPerformanceIcon(quiz.percentage)}
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-0 space-y-6">
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm text-slate-300 flex items-center gap-2">
                                            <Award className="h-4 w-4 text-purple-400" />
                                            Score
                                        </span>
                                        <span
                                            className={`text-xl font-bold ${getScoreColor(quiz.percentage)}`}
                                        >
                                            {quiz.score}/{quiz.totalQuestions}
                                        </span>
                                    </div>
                                    <Progress
                                        value={quiz.percentage}
                                        className="h-3 bg-slate-700/50 rounded-full"
                                    />
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-slate-400">
                                            Performance
                                        </span>
                                        <span
                                            className={`text-sm font-semibold ${getScoreColor(quiz.percentage)}`}
                                        >
                                            {quiz.percentage}%
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => handleGetFeedback(quiz.id)}
                                    disabled={generatingFeedback === quiz.id}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg"
                                >
                                    {generatingFeedback === quiz.id ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Generating...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Brain className="h-5 w-5" />
                                            Get AI Feedback
                                        </div>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 pb-8">
                    <Button
                        onClick={() => router.push("/start")}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-3 text-md rounded-xl"
                    >
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Take Another Quiz
                    </Button>
                </div>
            </div>
        </main>
    );
}
