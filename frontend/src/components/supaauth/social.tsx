"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord } from "react-icons/fa";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export default function Social({ redirectTo }: { redirectTo: string }) {
    const loginWithProvider = async (provider: "discord" | "google") => {
        const supbase = createSupabaseBrowser();
        await supbase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo:
                    window.location.origin +
                    `/auth/callback?next=` +
                    redirectTo,
            },
        });
    };

    return (
        <div className="w-full flex gap-2">
            <Button
                className="flex-1 h-8 flex items-center gap-2 text-black"
                variant="outline"
                onClick={() => loginWithProvider("discord")}
            >
                <FaDiscord />
                Discord
            </Button>
            <Button
                className="flex-1 h-8 flex items-center gap-2 text-black"
                variant="outline"
                onClick={() => loginWithProvider("google")}
            >
                <FcGoogle />
                Google
            </Button>
        </div>
    );
}
