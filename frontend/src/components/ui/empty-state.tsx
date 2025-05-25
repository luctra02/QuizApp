"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: string;
  actionText: string;
  actionPath: string;
  secondaryActionText?: string;
  secondaryActionPath?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  actionText,
  actionPath,
  secondaryActionText,
  secondaryActionPath
}: EmptyStateProps) {
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
            onClick={() => router.push(actionPath)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 text-lg"
          >
            {actionText}
          </Button>
          {secondaryActionText && secondaryActionPath && (
            <Button
              onClick={() => router.push(secondaryActionPath)}
              variant="outline"
              className="border-purple-400/50 text-purple-300 hover:bg-purple-400/10 px-8 py-3 text-lg"
            >
              {secondaryActionText}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}