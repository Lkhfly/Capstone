"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import NavBar from '@/components/ui/navbar';

const Home = () => {
    return (
        <div>
            <NavBar />
                <main className="container mx-auto py-10">
                    <h1 className="font-bold text-2xl">GM PFC Management Tool</h1>
                    <h1 className="mt-5">Welcome to the tool, we hope you have a great experience</h1>
                </main>
        </div>
    );
};

export default Home;
