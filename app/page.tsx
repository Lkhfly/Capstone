"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Home = () => {
    const pathname = usePathname();
    const [isLocalhost, setIsLocalhost] = useState(false);

    useEffect(() => {
        if (window.location.href === 'http://localhost:3000/') {
            setIsLocalhost(true);
        }
    }, []);

    return (
        <div>
            <header className="bg-blue-950 py-4">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="text-white text-2xl font-bold">
                        GM
                    </div>
                    <nav>
                        <Button className="bg-transparent text-white hover:bg-blue-800">
                            <Link href="/data_table">Data Table</Link>
                        </Button>
                        <Button className="bg-transparent text-white hover:bg-blue-800 ml-4">
                            <Link href="/chart">Chart</Link>
                        </Button>
                        <Button className="bg-transparent text-white hover:bg-blue-800 ml-4">
                            <Link href="/add-data">Add new PFC</Link>
                        </Button>
                    </nav>
                </div>
            </header>
            {isLocalhost && (
                <main className="container mx-auto py-10">
                    <h1 className="font-bold text-2xl">GM PFC Management Tool</h1>
                </main>
            )}
        </div>
    );
};

export default Home;
