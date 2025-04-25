import LoginButton from "@/components/LogInButton";

export default function Home() {

    return (
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
            <h1 className="text-4xl font-bold text-center sm:text-left">
                Welcome to the Quiz App!
            </h1>

            <p className="text-lg text-center sm:text-left">
                This is a simple example of a Next.js application.
            </p>
            <LoginButton />
        </main>
    );
}
