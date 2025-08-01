"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateGroup: (groupName: string, leaderName: string) => void;
    initialUserName: string;
}

export default function CreateGroupModal({ isOpen, onClose, onCreateGroup, initialUserName }: CreateGroupModalProps) {
    const [groupName, setGroupName] = useState("");
    // userName state is no longer directly used for group creation here, but kept for initial input
    const [userName, setUserName] = useState(initialUserName);
    const router = useRouter();

    useEffect(() => {
        setUserName(initialUserName);
    }, [initialUserName]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (groupName.trim()) {
            // Store groupName in local storage for the next step (pick-blob)
            localStorage.setItem("newGroupName", groupName);
            // Redirect to the pick-blob page for user creation
            router.push("/create-user/pick-blob");
            onClose(); // Close the modal
        } else {
            alert("Please enter a party name.");
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4 text-center">Create New Party</h2>
                <div className="mb-4">
                    <label htmlFor="groupName" className="block text-gray-700 text-sm font-bold mb-2">
                        Party Name:
                    </label>
                    <input
                        type="text"
                        id="groupName"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Enter party name"
                    />
                </div>
                {/* Removed userName input as it's handled in the new flow */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Next
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