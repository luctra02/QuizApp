"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/", emoji: "🏠" },
    { name: "Quiz History", path: "/history", emoji: "📜" },
    { name: "Statistics", path: "/stats", emoji: "📊" },
    { name: "AI Feedback", path: "/feedback", emoji: "🤖" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-900/95 backdrop-blur-md shadow-lg py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-2xl mr-2">🧠</span>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            QuizMaster
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center ${
                isActive(item.path)
                  ? "bg-purple-600/20 text-white"
                  : "text-blue-200 hover:bg-purple-600/10 hover:text-white"
              }`}
            >
              <span className="mr-2">{item.emoji}</span>
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="text-white hover:bg-purple-600/20"
                aria-label="Menu"
              >
                <span className="text-2xl">☰</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-slate-900/95 backdrop-blur-md border-slate-700 text-white w-64 px-0"
            >
              <div className="flex flex-col space-y-1 mt-8 px-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg transition-all duration-200 flex items-center ${
                      isActive(item.path)
                        ? "bg-purple-600/20 text-white"
                        : "text-blue-200 hover:bg-purple-600/10 hover:text-white"
                    }`}
                  >
                    <span className="mr-3 text-xl">{item.emoji}</span>
                    <span className="text-lg">{item.name}</span>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}