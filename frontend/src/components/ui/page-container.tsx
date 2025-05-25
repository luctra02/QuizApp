import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "7xl";
}

export function PageContainer({ children, maxWidth = "4xl" }: PageContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
    "7xl": "max-w-7xl"
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-6 pt-24">
      <div className={`w-full ${maxWidthClasses[maxWidth]} mx-auto px-4`}>
        {children}
      </div>
    </main>
  );
}