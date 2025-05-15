import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <main className="flex flex-col flex-grow items-center justify-center px-4 py-12 md:py-24">
                <div className="max-w-4xl w-full text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
                            QuizMaster
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-gray-200">
                        Challenge yourself, expand your knowledge, and track
                        your progress
                    </p>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <Card className="bg-white/10 backdrop-blur-sm border-white/20 border text-white">
                            <CardHeader>
                                <div className="text-blue-400 text-3xl">📜</div>
                                <CardTitle>Quiz History</CardTitle>
                                <CardDescription className="text-gray-300">
                                    Review all your past quizzes and revisit
                                    questions to reinforce learning
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="bg-white/10 backdrop-blur-sm border-white/20 border text-white">
                            <CardHeader>
                                <div className="text-green-400 text-3xl">
                                    📊
                                </div>
                                <CardTitle>Detailed Statistics</CardTitle>
                                <CardDescription className="text-gray-300">
                                    Track your performance with comprehensive
                                    analytics and visualizations
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="bg-white/10 backdrop-blur-sm border-white/20 border text-white">
                            <CardHeader>
                                <div className="text-purple-400 text-3xl">
                                    🤖
                                </div>
                                <CardTitle>AI Feedback</CardTitle>
                                <CardDescription className="text-gray-300">
                                    Receive personalized insights to improve
                                    your knowledge gaps
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/start">
                            <Button className="bg-gradient-to-r from-blue-500 to-green-500 text-white hover:opacity-90">
                                Start a Quiz
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <div className="w-full bg-gradient-to-r from-blue-900/30 to-green-900/30 py-10">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-6 text-white text-center">
                        Explore Our Features
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FeatureHighlight
                            icon="📜"
                            title="Quiz History"
                            path="/history"
                            description="Access your complete quiz archive with the ability to review questions and answers."
                        />
                        <FeatureHighlight
                            icon="📊"
                            title="Statistics"
                            path="/stats"
                            description="View detailed breakdowns of your performance across different categories and topics."
                        />
                        <FeatureHighlight
                            icon="🤖"
                            title="AI Feedback"
                            path="/feedback"
                            description="Get personalized insights and recommendations to improve your knowledge."
                        />
                        <FeatureHighlight
                            icon="🧠"
                            title="Knowledge Challenges"
                            path="/start"
                            description="Test yourself with thousands of questions across dozens of categories."
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="w-full bg-white/5 backdrop-blur-sm py-8">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-4 text-white">
                        Ready to test your knowledge?
                    </h2>
                    <p className="text-gray-300 mb-6">
                        Join thousands of quiz enthusiasts and start tracking
                        your progress today.
                    </p>
                    <div className="flex flex-wrap justify-center gap-8">
                        <Stat
                            label="Quizzes"
                            value="500+"
                            color="text-blue-400"
                        />
                        <Stat
                            label="Questions"
                            value="4K+"
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

function FeatureHighlight({
    icon,
    title,
    path,
    description,
}: {
    icon: string;
    title: string;
    path: string;
    description: string;
}) {
    return (
        <Link href={path}>
            <div className="flex items-start space-x-4 p-4 rounded-lg transition-all duration-200 hover:bg-white/5">
                <div className="text-3xl">{icon}</div>
                <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                        {title}
                    </h3>
                    <p className="text-gray-300">{description}</p>
                </div>
            </div>
        </Link>
    );
}
