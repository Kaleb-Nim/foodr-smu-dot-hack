"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface JoinGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function JoinGroupModal({ isOpen, onClose }: JoinGroupModalProps) {
    const [groupCode, setGroupCode] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    if (!isOpen) return null;

    const handleJoinGroup = async () => {
        setError(""); // Clear previous errors
        if (!groupCode.trim()) {
            setError("Please enter a group code.");
            return;
        }

        try {
            // First, check if the group exists
            const checkResponse = await fetch(`/api/groups/${groupCode}`);
            if (!checkResponse.ok) {
                const errorData = await checkResponse.json();
                setError(errorData.message || "Group not found. Please check the code.");
                return;
            }

            router.push(`/join/${groupCode}`);
            onClose();
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            console.error("Join group error:", err);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4 text-center">Join Party</h2>
                <div className="mb-4">
                    <label htmlFor="groupCode" className="block text-gray-700 text-sm font-bold mb-2">
                        Party Code:
                    </label>
                    <input
                        type="text"
                        id="groupCode"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={groupCode}
                        onChange={(e) => setGroupCode(e.target.value)}
                        placeholder="Enter party code"
                    />
                </div>
                {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleJoinGroup}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Join
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}