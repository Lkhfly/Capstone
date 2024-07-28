"use client";
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import Logo from "./logo2.png"
import { Button } from "@/components/ui/button";
const NavBar = () => {


    return (
        <div>
            <header className="bg-[#21559F] py-3 mb-5">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="text-white text-2xl font-bold font-sans">
                      <Link href="/">
                            <Image
                              src={Logo} // Path to your logo image
                              alt="Logo"
                              width={95} // Adjust width as needed
                              height={95} // Adjust height as needed
                            />
                      </Link>
                    </div>
                    <nav>
                        <Button className="bg-transparent text-white hover:bg-[#1A4B8F]">
                            <Link href="/data_table">Data Table</Link>
                        </Button>
                        <Button className="bg-transparent text-white hover:bg-[#1A4B8F] ml-4">
                            <Link href="/chart">Chart</Link>
                        </Button>
                        <Button className="bg-transparent text-white hover:bg-[#1A4B8F] ml-4">
                            <Link href="/add-data">Add new PFC</Link>
                        </Button>
                    </nav>
                </div>
            </header>
            {/* {isLocalhost && (
                <main className="container mx-auto py-10">
                    <h1 className="font-bold text-2xl">GM PFC Management Tool</h1>
                </main>
            )} */}
        </div>
    );
};

export default NavBar;
