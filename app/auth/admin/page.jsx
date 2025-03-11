"use client";

import React, { useState } from "react";
import NavBar from '@/components/ui/navbar';
import plantCoordinators from "../../../plantcoordinators.json";

const Admin = () => {
    const [newUser, setNewUser] = useState('');
    const [newUserConfirmed, setNewUserConfirmed] = useState('');
    const [message, setMessage] = useState({ text: "", type: "" });

    const onSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload

        if (newUser !== newUserConfirmed) {
            setMessage({ text: "Emails do not match!", type: "error" });
            return;
        }

        if (plantCoordinators.plant_coordinators.includes(newUser)) {
            setMessage({ text: "User is already a coordinator!", type: "error" });
            return;
        }

        try {
            const response = await fetch("/api/addCoordinator", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: newUser }),
            });

            const result = await response.json();

            if (response.ok) {
                setMessage({ text: "Coordinator added successfully!", type: "success" });
            } else {
                setMessage({ text: result.message, type: "error" });
            }
        } catch (error) {
            setMessage({ text: "Something went wrong. Please try again.", type: "error" });
        }
    };

    return (
        <div>
            <NavBar />
            <div className="mt-10 h-screen w-full flex items-center justify-center bg-blue-600">
                <div className="w-[400px] p-8 bg-white shadow-xl rounded-2xl">
                    <div className="text-center">
                        <h3 className="text-gray-800 text-2xl font-semibold">Admin functions</h3>
                        <p className="text-gray-500 text-sm">Enter account to allow re-con privilege</p>
                    </div>

                    {message.text && (
                        <p className={`mt-4 text-center ${message.type === "error" ? "text-red-500" : "text-green-500"}`}>
                            {message.text}
                        </p>
                    )}

                    <form onSubmit={onSubmit} className="mt-6 space-y-4">
                        <div>
                            <label className="text-sm text-gray-700 font-medium">User email</label>
                            <input
                                type="email"
                                value={newUser}
                                onChange={(e) => setNewUser(e.target.value)}
                                className="w-full mt-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition duration-300"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-700 font-medium">Confirm User email</label>
                            <input
                                type="email"
                                value={newUserConfirmed}
                                onChange={(e) => setNewUserConfirmed(e.target.value)}
                                className="w-full mt-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition duration-300"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 font-medium rounded-lg transition duration-300  text-black"
                        >
                            Enter
                        </button>


                    </form>
                </div>
            </div>
        </div>
    );
};

export default Admin;
