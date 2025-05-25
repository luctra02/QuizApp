"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  secondaryActionPath?: string;
  icon?: string;
}

export function ErrorState({
  title = "Error",
  description,
  actionText = "Try Again",
  onAction,
  secondaryActionText,
  secondaryActionPath,
  icon = "⚠️"
}: ErrorStateProps) {
  const router = useRouter();

  return (
    <Card className="bg-slate-900/60 backdrop-blur-xl border-red-500/20 rounded-2xl shadow-2xl text-white">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="text-6xl mb-6">{icon}</div>
        <CardTitle className="text-2xl text-red-400 mb-3">
          {title}
        </CardTitle>
        <CardDescription className="text-slate-300 text-center text-lg mb-6">
          {description}
        </CardDescription>
        <div className="flex gap-4">
          {onAction && (
            <Button
              onClick={onAction}
              variant="outline"
              className="border-red-400/50 text-red-300 hover:bg-red-400/10 px-8 py-3"
            >
              {actionText}
            </Button>
          )}
          {secondaryActionText && secondaryActionPath && (
            <Button
              onClick={() => router.push(secondaryActionPath)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3"
            >
              {secondaryActionText}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}