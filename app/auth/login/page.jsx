"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { doSignInWithEmailAndPassword } from "../../firebase/auth";
import { useAuth } from "../../contexts/auth";

const Login = () => {
    const { userLoggedIn } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (userLoggedIn) {
            router.push("/");
        }
    }, [userLoggedIn, router]);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            try {
                await doSignInWithEmailAndPassword(email, password);
                router.push("/");
            } catch (error) {
                setErrorMessage("Login failed. Please try again.");
                setIsSigningIn(false);
            }
        }
    };

    return (
        <div className="mt-10 h-screen w-full flex items-center justify-center bg-blue-600">
            <div className="w-[400px] p-8 bg-white shadow-xl rounded-2xl">
                <div className="text-center">
                    <h3 className="text-gray-800 text-2xl font-semibold">Welcome Back</h3>
                    <p className="text-gray-500 text-sm">Sign in to continue</p>
                </div>

                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="text-sm text-gray-700 font-medium">Email</label>
                        <input
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition duration-300"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-700 font-medium">Password</label>
                        <input
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition duration-300"
                        />
                    </div>

                    {errorMessage && (
                        <p className="text-red-500 text-sm font-semibold">{errorMessage}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isSigningIn}
                        className={`w-full py-2 text-blue-600 font-medium rounded-lg transition duration-300 ${
                            isSigningIn
                                ? "bg-gray-300 text-gray-800 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                        }`}
                    >
                        {isSigningIn ? "Signing In..." : "Enter"}
                    </button>

                </form>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        No account?{" "}
                        <Link
                            href="/auth/register"
                            className="text-blue-600 hover:underline font-medium"
                        >
                        Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
