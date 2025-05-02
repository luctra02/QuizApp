import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import LoginButton from "@/components/LogInButton";
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <main className="flex flex-col flex-grow items-center justify-center px-4 py-12 md:py-24">
                <div className="max-w-4xl w-full text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
                            QuizMinds
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-gray-200">
                        Challenge yourself, expand your knowledge, and compete
                        with friends
                    </p>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <Card className="bg-white/10 backdrop-blur-sm border-white/20 border text-white">
                            <CardHeader>
                                <div className="text-blue-400 text-3xl">🧠</div>
                                <CardTitle>Knowledge Challenges</CardTitle>
                                <CardDescription className="text-gray-300">
                                    Thousands of questions across dozens of
                                    categories
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="bg-white/10 backdrop-blur-sm border-white/20 border text-white">
                            <CardHeader>
                                <div className="text-green-400 text-3xl">
                                    🤖
                                </div>
                                <CardTitle>AI-Powered Feedback</CardTitle>
                                <CardDescription className="text-gray-300">
                                    Get personalized insights on your
                                    performance
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="bg-white/10 backdrop-blur-sm border-white/20 border text-white">
                            <CardHeader>
                                <div className="text-purple-400 text-3xl">
                                    🏆
                                </div>
                                <CardTitle>Leaderboards</CardTitle>
                                <CardDescription className="text-gray-300">
                                    Compete with friends and climb the rankings
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <LoginButton />
                        <Link href="/explore">
                            <Button
                                variant="outline"
                                className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20"
                            >
                                Explore Quizzes
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

            {/* Bottom Section */}
            <div className="w-full bg-white/5 backdrop-blur-sm py-8">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-4 text-white">
                        Ready to test your knowledge?
                    </h2>
                    <p className="text-gray-300 mb-6">
                        Join thousands of quiz enthusiasts and start your
                        journey today.
                    </p>
                    <div className="flex justify-center space-x-8">
                        <Stat
                            label="Quizzes"
                            value="500+"
                            color="text-blue-400"
                        />
                        <Stat
                            label="Questions"
                            value="10K+"
                            color="text-green-400"
                        />
                        <Stat
                            label="Users"
                            value="5K+"
                            color="text-purple-400"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function Stat({
    label,
    value,
    color,
}: {
    label: string;
    value: string;
    color: string;
}) {
    return (
        <div className="flex items-center">
            <span className={`${color} font-bold text-2xl mr-2`}>{value}</span>
            <span className="text-gray-300">{label}</span>
        </div>
    );
}
