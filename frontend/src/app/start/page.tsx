"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import useUser from "@/app/hooks/useUser";

type Category = {
    id: number;
    name: string;
};

export default function StartQuizPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [category, setCategory] = useState<string>("0");
    const [difficulty, setDifficulty] = useState("0");
    const [type, setType] = useState("0");
    const [questionCount, setQuestionCount] = useState("10"); // Default to 10 questions
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { data } = useUser();
    const supabase = createSupabaseBrowser();

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            try {
                const res = await fetch("https://opentdb.com/api_category.php");
                const data = await res.json();
                setCategories(data.trivia_categories);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleStart = async () => {
        const params = new URLSearchParams({
            category,
            difficulty,
            type,
            amount: questionCount, // Add the question count to params
        });

        if (data?.id) {
            const { data: quiz, error } = await supabase
                .from("quizzes")
                .insert({
                    user_id: data.id,
                    category_id: category,
                    difficulty_id: difficulty,
                    score: 0,
                    total_questions: parseInt(questionCount), // Use the selected question count
                })
                .select("id")
                .single();

            if (quiz) {
                params.set("quizId", quiz.id);
            }
        }

        router.push(`/quiz?${params.toString()}`);
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-6">
            {/* Quiz Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center">
                    <span className="mr-3 text-blue-400">🧠</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        QuizMaster
                    </span>
                </h1>
                <p className="text-lg text-blue-200">
                    Test your knowledge with our interactive quizzes!
                </p>
            </div>

            <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-md text-white">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 -mx-8 -mt-8 mb-6 p-6 rounded-t-xl flex items-center">
                    <span className="text-2xl mr-3">📚</span>
                    <h2 className="text-2xl font-bold text-white">
                        Customize Your Quiz
                    </h2>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-blue-200 flex items-center">
                            <span className="mr-2">✨</span>
                            Category
                        </Label>
                        <Select
                            value={category}
                            onValueChange={setCategory}
                            disabled={isLoading}
                        >
                            <SelectTrigger className="bg-slate-800 text-white border border-purple-500/50 focus:ring-purple-500 focus:border-purple-500 rounded-lg">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent
                                className="bg-slate-800 text-white border border-purple-500/50"
                                style={{ colorScheme: "dark" }}
                            >
                                <SelectItem
                                    value="0"
                                    className="focus:bg-purple-700/30 focus:text-white hover:text-white"
                                >
                                    Any Category
                                </SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem
                                        key={cat.id}
                                        value={cat.id.toString()}
                                        className="focus:bg-purple-700/30 focus:text-white hover:text-white"
                                    >
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-blue-200 flex items-center">
                            <span className="mr-2">🏆</span>
                            Difficulty
                        </Label>
                        <Select
                            value={difficulty}
                            onValueChange={setDifficulty}
                        >
                            <SelectTrigger className="bg-slate-800 text-white border border-purple-500/50 focus:ring-purple-500 focus:border-purple-500 rounded-lg">
                                <SelectValue placeholder="Select Difficulty" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 text-white border border-purple-500/50">
                                <SelectItem
                                    value="0"
                                    className="focus:bg-purple-700/30 focus:text-white hover:text-white"
                                >
                                    Any difficulty
                                </SelectItem>
                                <SelectItem
                                    value="1"
                                    className="focus:bg-purple-700/30 focus:text-white hover:text-white"
                                >
                                    <span className="flex items-center">
                                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                        Easy
                                    </span>
                                </SelectItem>
                                <SelectItem
                                    value="2"
                                    className="focus:bg-purple-700/30 focus:text-white hover:text-white"
                                >
                                    <span className="flex items-center">
                                        <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                                        Medium
                                    </span>
                                </SelectItem>
                                <SelectItem
                                    value="3"
                                    className="focus:bg-purple-700/30 focus:text-white hover:text-white"
                                >
                                    <span className="flex items-center">
                                        <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                                        Hard
                                    </span>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-blue-200 flex items-center">
                            <span className="mr-2">❓</span>
                            Question Type
                        </Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger className="bg-slate-800 text-white border border-purple-500/50 focus:ring-purple-500 focus:border-purple-500 rounded-lg">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 text-white border border-purple-500/50">
                                <SelectItem
                                    value="0"
                                    className="focus:bg-purple-700/30 focus:text-white hover:text-white"
                                >
                                    Any Type
                                </SelectItem>
                                <SelectItem
                                    value="multiple"
                                    className="focus:bg-purple-700/30 focus:text-white hover:text-white"
                                >
                                    Multiple Choice
                                </SelectItem>
                                <SelectItem
                                    value="boolean"
                                    className="focus:bg-purple-700/30 focus:text-white hover:text-white"
                                >
                                    True / False
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-blue-200 flex items-center">
                            <span className="mr-2">🔢</span>
                            Number of Questions
                        </Label>
                        <Select
                            value={questionCount}
                            onValueChange={setQuestionCount}
                        >
                            <SelectTrigger className="bg-slate-800 text-white border border-purple-500/50 focus:ring-purple-500 focus:border-purple-500 rounded-lg">
                                <SelectValue placeholder="Select number of questions" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 text-white border border-purple-500/50">
                                <SelectItem
                                    value="2"
                                    className="focus:bg-purple-700/30 focus:text-white hover:text-white"
                                >
                                    2 Questions
                                </SelectItem>
                                <SelectItem
                                    value="10"
                                    className="focus:bg-purple-700/30 focus:text-white hover:text-white"
                                >
                                    10 Questions
                                </SelectItem>
                                <SelectItem
                                    value="15"
                                    className="focus:bg-purple-700/30 focus:text-white hover:text-white"
                                >
                                    15 Questions
                                </SelectItem>
                                <SelectItem
                                    value="20"
                                    className="focus:bg-purple-700/30 focus:text-white hover:text-white"
                                >
                                    20 Questions
                                </SelectItem>
                                <SelectItem
                                    value="25"
                                    className="focus:bg-purple-700/30 focus:text-white hover:text-white"
                                >
                                    25 Questions
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        onClick={handleStart}
                        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/30"
                    >
                        Start Challenge
                    </Button>
                </div>

                {isLoading && (
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                )}
            </Card>

            <div className="text-blue-200 mt-6 text-sm text-center">
                Powered by Open Trivia DB • Challenge your friends!
            </div>
        </main>
    );
}
