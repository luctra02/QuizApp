"use client";

import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AuthRequiredProps {
    title?: string;
    description?: string;
    showRegister?: boolean;
    icon?: string;
}

export function AuthRequired({
    title = "Authentication Required",
    description = "Please log in to access this feature.",
    showRegister = true,
    icon = "🔒",
}: AuthRequiredProps) {
    const router = useRouter();

    return (
        <Card className="bg-slate-900/60 backdrop-blur-xl border-purple-500/20 rounded-2xl shadow-2xl text-white">
            <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="text-6xl mb-6">{icon}</div>
                <CardTitle className="text-2xl text-white mb-3">
                    {title}
                </CardTitle>
                <CardDescription className="text-slate-300 text-center text-lg mb-8">
                    {description}
                </CardDescription>
                <div className="flex gap-4">
                    <Button
                        onClick={() => router.push("/login")}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 text-lg"
                    >
                        Log In
                    </Button>
                    {showRegister && (
                        <Button
                            onClick={() => router.push("/register")}
                            className="bg-gradient-to-r from-blue-500 to-green-500 hover:opacity-90 hover:bg-purple-400/10 px-8 py-3 text-lg"
                        >
                            Register
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
