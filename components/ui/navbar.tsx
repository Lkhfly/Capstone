"use client";
import { useEffect, useState } from 'react';
import { User } from "firebase/auth";
import { auth } from '@/app/firebase/config';
import Image from "next/image";
import Link from "next/link";
import Logo from "./logo2.png";
import { Button } from "@/components/ui/button";
import plantCoordinators from '../../plantcoordinators.json';

const NavBar = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isCoordinator, setIsCoordinator] = useState(false);
    const [isMounted, setIsMounted] = useState(false); // Flag to check if component has mounted

    useEffect(() => {
        setIsMounted(true); // Mark component as mounted
    }, []);

    useEffect(() => {
        if (!isMounted) return; // Prevent localStorage access before mount

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                const storedEmail = localStorage.getItem("email"); // Access only after mount
                console.log("getting email:"+storedEmail)
                if (storedEmail && plantCoordinators.plant_coordinators.includes(storedEmail)) {
                    setIsCoordinator(true);
                }
            } else {
                setUser(null);
                setIsCoordinator(false);
            }
        });

        return () => unsubscribe();
    }, [isMounted]); // Depend on `isMounted` to ensure it only runs after mount

    return (
        <div>
            <header className="bg-[#21559F] py-3 mb-5">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="text-white text-2xl font-bold font-sans">
                        {/* Navbar content */}
                    </div>
                    <nav>
                        {user ? (
                            <>
                                {isCoordinator && (
                                    <>
                                        <Button className="bg-transparent text-white hover:bg-[#1A4B8F]">
                                            <Link href="/data_table">Data Table</Link>
                                        </Button>
                                        <Button className="bg-transparent text-white hover:bg-[#1A4B8F] ml-4">
                                            <Link href="/chart">Chart</Link>
                                        </Button>
                                    </>
                                )}
                                <Button className="bg-transparent text-white hover:bg-[#1A4B8F] ml-4">
                                    <Link href="/add-data">Add new PFC</Link>
                                </Button>
                                <Button className="bg-transparent text-white hover:bg-[#1A4B8F] ml-4">
                                    <Link href="/">Home</Link>
                                </Button>
                                <Button className="bg-transparent text-white hover:bg-[#1A4B8F] ml-4"
                                        onClick={async () => {
                                            await auth.signOut();
                                            if (isMounted) {
                                                localStorage.removeItem("email"); // Clear localStorage after mount
                                            }
                                            window.location.href = "/";
                                        }}
                                >
                                    Sign Out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button className="bg-transparent text-white hover:bg-[#1A4B8F] ml-4">
                                    <Link href="/auth/login">Sign In</Link>
                                </Button>
                                <Button className="bg-transparent text-white hover:bg-[#1A4B8F] ml-4">
                                    <Link href="/auth/register">Register</Link>
                                </Button>
                            </>
                        )}
                    </nav>
                </div>
            </header>
        </div>
    );
};

export default NavBar;
