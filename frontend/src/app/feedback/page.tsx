"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function AIFeedbackPage() {
  // In a real app, you would fetch this data from your API
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState(null);
  const [activeTab, setActiveTab] = useState("performance");

  // Simulate API call to get user quiz data
  useEffect(() => {
    const fetchUserData = () => {
      // This would be a real API call in production
      setTimeout(() => {
        setUserStats({
          totalQuizzes: 12,
          averageScore: 76,
          topCategory: "Science",
          weakestCategory: "History",
          recentQuizzes: [
            { id: 1, title: "World Geography", score: 85, date: "2025-05-01", category: "Geography" },
            { id: 2, title: "Historical Figures", score: 62, date: "2025-04-28", category: "History" },
            { id: 3, title: "Physics Fundamentals", score: 78, date: "2025-04-25", category: "Science" },
          ],
          categoryPerformance: [
            { category: "Science", score: 82, quizCount: 4 },
            { category: "History", score: 65, quizCount: 3 },
            { category: "Geography", score: 79, quizCount: 3 },
            { category: "Literature", score: 70, quizCount: 2 },
          ],
          skillGaps: [
            { skill: "Historical Dates", accuracy: 58 },
            { skill: "Chemical Formulas", accuracy: 64 },
            { skill: "Famous Authors", accuracy: 67 },
          ],
          recommendations: [
            { 
              title: "Focus on Historical Context", 
              description: "Your answers show you're memorizing dates but missing the broader historical context. Try our 'Historical Connections' quiz series.",
              quizId: "hist-conn-101"
            },
            { 
              title: "Science Fundamentals", 
              description: "While you excel at complex science questions, our AI noticed some gaps in fundamentals. The 'Back to Basics' science quiz will help solidify your foundation.",
              quizId: "sci-basics-1"
            },
            { 
              title: "Spaced Repetition for Geography", 
              description: "Your accuracy decreases on geography questions you haven't seen in over 2 weeks. Try shorter, more frequent review sessions.",
              quizId: "geo-review-pack"
            }
          ],
          learningStyle: "Visual with strong logical reasoning",
          idealQuizLength: "15-20 questions",
          bestTimeOfDay: "Evening sessions show 14% better results",
          streakDays: 5
        });
        setLoading(false);
      }, 1200);
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <h2 className="text-xl text-blue-300">Analyzing your quiz data...</h2>
          <p className="text-blue-200 mt-2">Our AI is generating personalized insights</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-6 pt-16">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center">
          <span className="mr-3 text-blue-400">🧠</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Your Personal AI Coach
          </span>
        </h1>
        <p className="text-blue-200 mb-8">Personalized insights and recommendations based on your quiz performance</p>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-4 rounded-xl shadow-lg text-white">
            <p className="text-sm text-blue-300">Quizzes Completed</p>
            <h3 className="text-3xl font-bold">{userStats.totalQuizzes}</h3>
            <div className="mt-2 flex items-center">
              <span className="text-green-400">+3</span>
              <span className="text-blue-200 text-xs ml-2">this week</span>
            </div>
          </Card>
          
          <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-4 rounded-xl shadow-lg text-white">
            <p className="text-sm text-blue-300">Average Score</p>
            <h3 className="text-3xl font-bold">{userStats.averageScore}%</h3>
            <div className="mt-2 flex items-center">
              <span className="text-green-400">+2.5%</span>
              <span className="text-blue-200 text-xs ml-2">last 5 quizzes</span>
            </div>
          </Card>
          
          <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-4 rounded-xl shadow-lg text-white">
            <p className="text-sm text-blue-300">Strongest Category</p>
            <h3 className="text-3xl font-bold">{userStats.topCategory}</h3>
            <div className="mt-2 flex items-center">
              <span className="text-blue-200 text-xs">82% average accuracy</span>
            </div>
          </Card>
          
          <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-4 rounded-xl shadow-lg text-white">
            <p className="text-sm text-blue-300">Current Streak</p>
            <h3 className="text-3xl font-bold">{userStats.streakDays} days</h3>
            <div className="mt-2 flex items-center">
              <span className="text-yellow-400">🔥</span>
              <span className="text-blue-200 text-xs ml-2">Keep it going!</span>
            </div>
          </Card>
        </div>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="performance" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
            <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
            <TabsTrigger value="insights">Learning Insights</TabsTrigger>
          </TabsList>
          
          {/* Performance Analysis Tab */}
          <TabsContent value="performance" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="col-span-1 bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-6 rounded-xl shadow-lg text-white">
                <h2 className="text-xl font-semibold mb-4 text-blue-300">Category Performance</h2>
                
                <div className="space-y-4">
                  {userStats.categoryPerformance.map((category, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-blue-200">{category.category}</span>
                        <span className="text-blue-300">{category.score}%</span>
                      </div>
                      <Progress value={category.score} className="h-2 bg-slate-800" />
                      <p className="text-xs text-blue-200 mt-1">{category.quizCount} quizzes taken</p>
                    </div>
                  ))}
                </div>
              </Card>
              
              <Card className="col-span-1 lg:col-span-2 bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-6 rounded-xl shadow-lg text-white">
                <h2 className="text-xl font-semibold mb-4 text-blue-300">Skill Gap Analysis</h2>
                
                <div className="mb-6">
                  <p className="text-blue-200 text-sm mb-4">
                    Our AI has identified these specific areas where focused practice could significantly improve your overall scores:
                  </p>
                  
                  <div className="space-y-6">
                    {userStats.skillGaps.map((gap, index) => (
                      <div key={index} className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/20">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium text-blue-300">{gap.skill}</h3>
                          <Badge className={`${gap.accuracy < 60 ? 'bg-red-900/50 text-red-200' : gap.accuracy < 70 ? 'bg-yellow-900/50 text-yellow-200' : 'bg-green-900/50 text-green-200'}`}>
                            {gap.accuracy}% Accuracy
                          </Badge>
                        </div>
                        
                        <Progress 
                          value={gap.accuracy} 
                          className="h-2 mb-3" 
                          indicatorClassName={gap.accuracy < 60 ? 'bg-red-500' : gap.accuracy < 70 ? 'bg-yellow-500' : 'bg-green-500'} 
                        />
                        
                        <div className="flex justify-between">
                          <Button size="sm" variant="outline" className="text-xs border-blue-500/30 text-blue-400 hover:bg-blue-950/30">
                            Practice Questions
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs border-blue-500/30 text-blue-400 hover:bg-blue-950/30">
                            Resource Library
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-blue-300 mb-3">Recent Quiz Performance</h3>
                  
                  <div className="space-y-3">
                    {userStats.recentQuizzes.map((quiz, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-800/30 p-3 rounded-lg">
                        <div>
                          <h4 className="font-medium text-white">{quiz.title}</h4>
                          <div className="flex items-center mt-1">
                            <Badge className="bg-blue-900/50 text-blue-200 mr-2">{quiz.category}</Badge>
                            <span className="text-xs text-blue-200">{quiz.date}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-lg font-bold ${quiz.score >= 80 ? 'text-green-400' : quiz.score >= 70 ? 'text-blue-400' : 'text-yellow-400'}`}>
                            {quiz.score}%
                          </span>
                          <Button size="sm" variant="ghost" className="block ml-auto text-xs text-blue-300 hover:bg-blue-950/30 mt-1">
                            Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          {/* AI Recommendations Tab */}
          <TabsContent value="recommendations" className="mt-0">
            <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-6 rounded-xl shadow-lg text-white">
              <h2 className="text-xl font-semibold mb-2 text-blue-300">Personalized Recommendations</h2>
              <p className="text-blue-200 text-sm mb-6">Based on your quiz history and performance patterns, our AI suggests:</p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {userStats.recommendations.map((rec, index) => (
                  <div key={index} className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-5 rounded-xl border border-purple-500/30">
                    <div className="flex items-start mb-3">
                      {index === 0 && <span className="text-2xl mr-3">🏛️</span>}
                      {index === 1 && <span className="text-2xl mr-3">🔬</span>}
                      {index === 2 && <span className="text-2xl mr-3">🌍</span>}
                      <h3 className="text-lg font-medium text-blue-300">{rec.title}</h3>
                    </div>
                    <p className="text-blue-100 mb-4">{rec.description}</p>
                    <div className="flex space-x-3">
                      <Button className="bg-blue-600 hover:bg-blue-700">Start Quiz</Button>
                      <Button variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-950/30">Add to Playlist</Button>
                    </div>
                  </div>
                ))}
                
                <div className="lg:col-span-2 bg-blue-900/20 border border-blue-500/30 p-5 rounded-xl mt-2">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">🤖</span>
                    <div>
                      <h3 className="font-medium text-blue-300 mb-1">AI Coach Suggestion</h3>
                      <p className="text-blue-100">
                        Based on your answer patterns, I notice you perform better on questions that involve visual reasoning. 
                        For your History topics (your current weak area), try our visual timeline quizzes instead of date-focused ones.
                      </p>
                      <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Try Visual History Timeline</Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          {/* Learning Insights Tab */}
          <TabsContent value="insights" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-6 rounded-xl shadow-lg text-white">
                <h2 className="text-xl font-semibold mb-4 text-blue-300">Learning Style Analysis</h2>
                
                <div className="space-y-6">
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/20">
                    <h3 className="font-medium text-blue-300 mb-2">Your Learning Style</h3>
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-3">👁️</span>
                      <div>
                        <p className="text-blue-100 font-medium">{userStats.learningStyle}</p>
                        <p className="text-blue-200 text-sm mt-1">
                          You excel at questions with diagrams, charts, and visual representations.
                        </p>
                      </div>
                    </div>
                    <div className="bg-blue-900/20 p-3 rounded-lg text-sm text-blue-100">
                      Try our new <span className="font-medium">Visual Learning Mode</span> that emphasizes diagrams and infographics.
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/20">
                    <h3 className="font-medium text-blue-300 mb-2">Optimal Quiz Patterns</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <span className="text-xl mr-2">⏱️</span>
                        <div>
                          <p className="text-blue-100 font-medium">Quiz Length</p>
                          <p className="text-blue-200 text-sm">{userStats.idealQuizLength}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="text-xl mr-2">🌙</span>
                        <div>
                          <p className="text-blue-100 font-medium">Best Time</p>
                          <p className="text-blue-200 text-sm">{userStats.bestTimeOfDay}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-6 rounded-xl shadow-lg text-white">
                <h2 className="text-xl font-semibold mb-4 text-blue-300">Long-term Improvement Plan</h2>
                
                <div className="mb-6">
                  <p className="text-blue-200 mb-4">
                    Based on your current progress, our AI has created a custom 4-week improvement plan:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-purple-500/20">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-blue-300">Week 1: History Foundations</h3>
                        <Badge className="bg-purple-900/50 text-purple-200">Current</Badge>
                      </div>
                      <p className="text-blue-200 text-sm mt-1">
                        Focus on historical periods and major events with visual timeline exercises
                      </p>
                    </div>
                    
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-purple-500/20">
                      <h3 className="font-medium text-blue-300">Week 2: Science Fundamentals</h3>
                      <p className="text-blue-200 text-sm mt-1">
                        Reinforce basic scientific principles with interactive experiments
                      </p>
                    </div>
                    
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-purple-500/20">
                      <h3 className="font-medium text-blue-300">Week 3: Cross-Topic Connections</h3>
                      <p className="text-blue-200 text-sm mt-1">
                        Special quiz series that connects historical events with scientific discoveries
                      </p>
                    </div>
                    
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-purple-500/20">
                      <h3 className="font-medium text-blue-300">Week 4: Comprehensive Review</h3>
                      <p className="text-blue-200 text-sm mt-1">
                        Mixed quizzes that target your improving areas with adaptive difficulty
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center mt-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">Activate 4-Week Plan</Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Footer Section */}
        <div className="mt-8 bg-slate-900/80 backdrop-blur-md border-purple-500/30 border p-4 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-xl mr-3">💡</span>
              <p className="text-blue-200 text-sm">
                Your AI analysis refreshes after each quiz. <span className="text-blue-300">Last updated 2 hours ago</span>
              </p>
            </div>
            <Button variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-950/30 text-sm">
              Refresh Analysis
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}