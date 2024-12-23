"use client"; // Ensure it's a client component

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Next.js App Router redirection
import Link from 'next/link'; // Use Next.js Link for navigation
import { useAuth } from '../../contexts/auth'; // Assuming you have this context correctly set up
import { doCreateUserWithEmailAndPassword } from '../../firebase/auth'; // Firebase auth function

const Register = () => {
    const router = useRouter(); // App Router redirection

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { userLoggedIn } = useAuth(); // Get logged-in status from the context

    const onSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        if (!isRegistering) {
            setIsRegistering(true);
            try {
                await doCreateUserWithEmailAndPassword(email, password);
                router.push('/'); // Redirect to home page after successful registration
            } catch (error) {
                setErrorMessage('Registration failed. Please try again.');
            } finally {
                setIsRegistering(false);
            }
        }
    };

    // Redirect if user is already logged in
    if (userLoggedIn) {
        router.push('/');
        return null; // Avoid rendering the form if the user is already logged in
    }

    return (
        <main className="w-full h-screen flex self-center place-content-center place-items-center">
            <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
                <div className="text-center mb-6">
                    <div className="mt-2">
                        <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">
                            Create a New Account
                        </h3>
                    </div>
                </div>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-600 font-bold">Email</label>
                        <input
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600 font-bold">Password</label>
                        <input
                            disabled={isRegistering}
                            type="password"
                            autoComplete="new-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600 font-bold">Confirm Password</label>
                        <input
                            disabled={isRegistering}
                            type="password"
                            autoComplete="off"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                        />
                    </div>

                    {errorMessage && (
                        <span className="text-red-600 font-bold">{errorMessage}</span>
                    )}

                    <button
                        type="submit"
                        disabled={isRegistering}
                        className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
                            isRegistering
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'
                        }`}
                    >
                        {isRegistering ? 'Signing Up...' : 'Sign Up'}
                    </button>

                    <div className="text-sm text-center">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="hover:underline font-bold">
                            Continue
                        </Link>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Register;
