"use client";

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingState({ 
  title = "Loading", 
  description = "Please wait...",
  size = "md" 
}: LoadingStateProps) {
  const iconSizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-16 w-16"
  };

  const titleSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <Card className="bg-slate-900/60 backdrop-blur-xl border-purple-500/20 rounded-2xl shadow-2xl text-white">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <Loader2 className={`${iconSizes[size]} animate-spin text-purple-400 mb-6`} />
        <CardTitle className={`${titleSizes[size]} text-white mb-3`}>
          {title}
        </CardTitle>
        <CardDescription className="text-slate-300 text-center text-lg">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}