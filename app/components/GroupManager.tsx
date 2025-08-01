"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import NameInputModal from './NameInputModal';
// import { io, Socket } from "socket.io-client"; // Removed Socket.IO import

interface GroupManagerProps {
    initialMode: 'create' | 'join' | 'none';
    onBack: () => void;
    userName: string; // Add userName to props
    groupName?: string; // Add groupName to props, optional as it's only for create mode
}

export default function GroupManager({ initialMode, onBack, userName, groupName }: GroupManagerProps) {
    const [groupCode, setGroupCode] = useState("");
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const [message, setMessage] = useState("");
    const [isNameModalOpen, setIsNameModalOpen] = useState(false); // This might not be needed anymore
    const [userId, setUserId] = useState("");
    const router = useRouter();
    // const [socket, setSocket] = useState<Socket | null>(null); // Removed socket state

    const handleCreateGroup = useCallback(async () => {
        setMessage("");
        setGroupCode("");
        setQrCodeDataUrl("");
        if (!userName || !groupName) { // Ensure name and group name are available from props
            setMessage("User name or group name is missing.");
            return;
        }
        try {
            const response = await fetch("/api/groups/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userName, groupName }), // Pass groupName
            });
            const data = await response.json();
            if (response.ok) {
                setGroupCode(data.code);
                setQrCodeDataUrl(data.qrCodeDataUrl);
                setMessage("Party created successfully!");
                localStorage.setItem('userId', data.userId); // Store the userId returned from the API
                localStorage.setItem('isLeader', 'true'); // Mark as leader
                router.push(`${data.redirectUrl}`); // Redirect to holding room with userName
            } else {
                setMessage(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error("Failed to create party:", error);
            setMessage("Failed to create party.");
        }
    }, [userName, groupName, router]);

    useEffect(() => {
        // Removed Socket.IO connection and event listeners as they are no longer needed.
        // The joinGroup logic is now handled by the API route and SSE.
        if (initialMode === 'create' && userName && groupName) {
            console.log("GroupManager: Calling handleCreateGroup with:", { userName, groupName });
            handleCreateGroup();
        }
    }, [initialMode, userName, groupName, handleCreateGroup]); // Add handleCreateGroup to dependency array

    const handleJoinGroup = useCallback(async () => {
        setMessage("");
        if (!joinCode) {
            setMessage("Please enter a party code to join.");
            return;
        }
        if (!userName) { // Ensure name is available
            setMessage("Please save your name first.");
            return;
        }
        try {
            const response = await fetch("/api/groups/join", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code: joinCode, userName }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                localStorage.setItem('userId', data.userId); // Store the userId returned from the API
                router.push(`${data.redirectUrl}`); // Redirect to holding room with userName
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Failed to join party:", error);
            setMessage("Failed to join party.");
        }
    }, [joinCode, userName, router]);

    // Removed the useEffect that automatically calls handleCreateGroup

    return (
        <div className="p-4">
            {initialMode === 'create' && (
                <div className="bg-yellow-200 p-6 rounded-lg shadow-md text-center">
                    <h3 className="text-xl font-bold mb-4">Party will be created shortly...</h3>
                    {message && (
                        <p className={`mt-4 ${message.includes("Error") ? "text-red-700" : "text-green-700"}`}>
                            {message}
                        </p>
                    )}
                </div>
            )}

            {initialMode === 'join' && (
                <div className="bg-yellow-200 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-4 text-center">Join Party</h3>
                    <input
                        type="text"
                        placeholder="Enter Party Code"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md mb-4 text-center text-lg"
                    />
                    <button
                        onClick={handleJoinGroup}
                        className="w-full py-3 bg-blue-800 text-white rounded-md text-lg font-semibold hover:bg-blue-900 transition-colors"
                    >
                        Join Party
                    </button>
                    {message && (
                        <p className={`mt-4 text-center ${message.includes("Error") ? "text-red-700" : "text-green-700"}`}>
                            {message}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}