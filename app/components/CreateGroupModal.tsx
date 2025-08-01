"use client";

import React, { useState, useEffect } from 'react';

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateGroup: (groupName: string, userName: string) => void;
    initialUserName: string;
}

export default function CreateGroupModal({ isOpen, onClose, onCreateGroup, initialUserName }: CreateGroupModalProps) {
    const [groupName, setGroupName] = useState("");
    const [userName, setUserName] = useState(initialUserName);

    useEffect(() => {
        setUserName(initialUserName);
    }, [initialUserName]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (groupName.trim() && userName.trim()) {
            onCreateGroup(groupName, userName);
            setGroupName(""); // Clear input after submission
        } else {
            alert("Please enter both group name and your name.");
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
                <div className="mb-6">
                    <label htmlFor="userName" className="block text-gray-700 text-sm font-bold mb-2">
                        Your Name:
                    </label>
                    <input
                        type="text"
                        id="userName"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter your name"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Create Party
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