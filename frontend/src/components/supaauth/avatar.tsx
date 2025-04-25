"use client";
import useUser from "@/app/hooks/useUser";
import Image from "next/image";

export default function Avatar() {
    const { data, isFetching } = useUser();

    if (isFetching || !data) {
        return (
            <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
        );
    }

    const imageUrl = data.user_metadata?.avatar_url;
    const emailInitial = data.email?.[0]?.toUpperCase() || "?";

    return !imageUrl ? (
        <div className="w-10 h-10 bg-muted text-muted-foreground flex items-center justify-center rounded-full">
            <p className="text-4xl -translate-y-1">{emailInitial}</p>
        </div>
    ) : (
        <Image
            src={imageUrl}
            alt="user avatar"
            width={50}
            height={50}
            className="rounded-full object-cover w-10 h-10"
        />
    );
}
