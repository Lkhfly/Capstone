"use client";
import { useEffect, useState } from 'react';
import { User } from "firebase/auth"; // Import Firebase User type
import { auth } from '@/app/firebase/config'; // Make sure the auth module is correctly imported
import Image from "next/image";
import Link from "next/link";
import Logo from "./logo2.png"
import { Button } from "@/components/ui/button";


const NavBar = () => {
    // Define the state to accept both User or null
    const [user, setUser] = useState<User | null>(null);

    // Check authentication status
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user); // Set user when logged in
            } else {
                setUser(null); // Set to null when logged out
            }
        });

        return () => unsubscribe(); // Clean up the listener on unmount
    }, []);

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
                                <Button className="bg-transparent text-white hover:bg-[#1A4B8F]">
                                    <Link href="/data_table">Data Table</Link>
                                </Button>
                                {/* Other authenticated user links */}
                                <Button className="bg-transparent text-white hover:bg-[#1A4B8F] ml-4">
                                    <Link href="/chart">Chart</Link>
                                </Button>
                                <Button className="bg-transparent text-white hover:bg-[#1A4B8F] ml-4">
                                    <Link href="/add-data">Add new PFC</Link>
                                </Button>
                                <Button className="bg-transparent text-white hover:bg-[#1A4B8F] ml-4">
                                    <Link href="/home">Home</Link>
                                </Button>
                                <Button className="bg-transparent text-white hover:bg-[#1A4B8F] ml-4"
                                        onClick={async () => {
                                            await auth.signOut();
                                            window.location.href = "/auth/login"; // Redirect after sign out
                                        }}
                                >
                                    Sign Out 2
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
