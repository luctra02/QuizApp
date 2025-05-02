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

type Category = {
    id: number;
    name: string;
};

export default function StartQuizPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [category, setCategory] = useState<string>("anycat");
    const [difficulty, setDifficulty] = useState("anydiff");
    const [type, setType] = useState("anytype");
    const router = useRouter();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("https://opentdb.com/api_category.php");
                const data = await res.json();
                setCategories(data.trivia_categories);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };

        fetchCategories();
    }, []);

    const handleStart = () => {
        if (!category) return;

        const params = new URLSearchParams({
            category,
            difficulty,
            type,
        });

        router.push(`/quiz?${params.toString()}`);
    };

    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <Card className="bg-black/30 p-6 md:p-10 rounded-2xl shadow-xl w-full max-w-md space-y-6 text-white">
                <h1 className="text-3xl font-bold text-center mb-4">
                    Start a Quiz
                </h1>

                <div className="space-y-2 ">
                    <Label>Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="bg-slate-800 text-white border border-slate-700">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 text-white border border-slate-700">
                            <SelectItem value="anycat">Any Category</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem
                                    key={cat.id}
                                    value={cat.id.toString()}
                                >
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Difficulty</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                        <SelectTrigger className="bg-slate-800 text-white border border-slate-700">
                            <SelectValue placeholder="Select Difficulty" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 text-white border border-slate-700">
                            <SelectItem value="anydiff">
                                Any difficulty
                            </SelectItem>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger className="bg-slate-800 text-white border border-slate-700">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 text-white border border-slate-700">
                            <SelectItem value="anytype">Any Type</SelectItem>
                            <SelectItem value="multiple">
                                Multiple Choice
                            </SelectItem>
                            <SelectItem value="boolean">
                                True / False
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button onClick={handleStart} className="w-full mt-4">
                    Start Quiz
                </Button>
            </Card>
        </main>
    );
}
