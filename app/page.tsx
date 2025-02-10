"use client";

import NavBar from '@/components/ui/navbar';

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="flex flex-col flex-grow justify-center items-center container mx-auto px-4">
                <h1 className="font-bold text-2xl">GM PFC Management Tool</h1>
                <h1 className="mt-5">Welcome to the tool, we hope you have a great experience</h1>
            </main>
        </div>
    );
};

export default Home;