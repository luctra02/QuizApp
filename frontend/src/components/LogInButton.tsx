"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import UserProfile from "./supaauth/user-profile";

const LoginButton = () => {
    const [user, setUser] = useState<unknown>(null);
    const router = useRouter();
    const supabase = createSupabaseBrowser();

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setUser(user);
        };
        fetchUser();
    }, [supabase.auth]);

    return (
        <div className="flex items-center">
            {user ? (
                <UserProfile />
            ) : (
                <Button
                    onClick={() => {
                        router.push("/login");
                    }}
                    className="rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200"
                    size="sm"
                >
                    <span className="mr-1">👤</span>
                    Log in
                </Button>
            )}
        </div>
    );
};

export default LoginButton;
