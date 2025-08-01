"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import QRCode from "qrcode";
import Image from "next/image";
import QrCodePopup from "@/app/components/QrCodePopup"; // Import the separate QrCodePopup component

interface Member {
    id: string;
    name: string;
}

interface GroupData {
    name?: string; // Make optional as it might not be present in error responses
    leaderId?: string; // Make optional
    members?: Member[]; // Make optional
    error?: string; // Add error property for error responses
}

export default function HoldingRoomPage() {
    const params = useParams();
    const router = useRouter();
    const groupCode = params.code as string;
    const searchParams = useSearchParams();
    const initialUserName = searchParams.get('userName') || 'Guest';
    const [members, setMembers] = useState<Member[]>([]);
    const [groupName, setGroupName] = useState<string>(""); // New state for group name
    const [leaderId, setLeaderId] = useState<string | null>(null); // New state for leader ID
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
    const [showQrPopup, setShowQrPopup] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!groupCode) {
            setMessage("No group code provided.");
            return;
        }

        // Fetch initial members from the database
        const fetchMembers = async () => {
            try {
                const response = await fetch(`/api/groups/${groupCode}/members`);
                const data: GroupData = await response.json();
                if (response.ok) {
                    setMembers(data.members || []);
                    setGroupName(data.name || ""); // Set group name, default to empty string if undefined
                    setLeaderId(data.leaderId || null); // Set leader ID, default to null if undefined
                } else {
                    setMessage(`Error fetching members: ${data.error || "Unknown error"}`);
                }
            } catch (error) {
                console.error("Failed to fetch members:", error);
                setMessage("Failed to fetch members.");
            }
        };
        fetchMembers();

        // Generate QR code on mount
        const generateQr = async () => {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
            const joinUrl = `${baseUrl}/join/${groupCode}`;
            try {
                const url = await QRCode.toDataURL(joinUrl);
                setQrCodeDataUrl(url);
            } catch (err) {
                console.error("Failed to generate QR code:", err);
                setMessage("Failed to generate QR code.");
            }
        };
        generateQr();

        // Polling for members
        const intervalId = setInterval(fetchMembers, 3000); // Poll every 3 seconds

        return () => {
            clearInterval(intervalId); // Clean up interval on unmount
        };
    }, [groupCode]);

    const handleStartParty = () => {
        // Logic to start the party, e.g., redirect to map with party ID
        router.push(`/map?partyId=${groupCode}`);
    };

    const handleLeaveGroup = async () => {
        const userId = localStorage.getItem('userId'); // Retrieve userId from local storage
        if (!userId) {
            setMessage("User ID not found. Cannot leave group.");
            return;
        }

        try {
            const response = await fetch(`/api/groups/${groupCode}/members/leave`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("Successfully left the group.");
                localStorage.removeItem('userId'); // Clear userId from local storage
                router.push('/'); // Redirect to home page or a confirmation page
            } else {
                setMessage(`Error leaving group: ${data.error}`);
            }
        } catch (error) {
            console.error("Failed to leave group:", error);
            setMessage("Failed to leave group.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                <h1 className="text-2xl font-bold mb-6">Holding Room</h1>
                {groupName && <h2 className="text-xl font-semibold mb-4">Group Name: <span className="font-bold text-purple-700">{groupName}</span></h2>}
                <p className="text-lg mb-4">Party Code: <span className="font-bold text-blue-700">{groupCode}</span></p>

                <button
                    onClick={() => setShowQrPopup(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors mb-6"
                >
                    Show Party Code & QR
                </button>

                <h3 className="text-xl font-semibold mb-4">Members:</h3>
                {members.length > 0 ? (
                    <ul className="list-disc list-inside mb-6">
                        {members.map(member => (
                            <li key={member.id} className="text-gray-700">{member.name}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 mb-6">No members yet. Share the code!</p>
                )}

                {message && (
                    <p className={`mt-4 ${message.includes("Error") ? "text-red-700" : "text-green-700"}`}>
                        {message}
                    </p>
                )}

                {leaderId === localStorage.getItem('userId') ? (
                    <button
                        onClick={handleStartParty}
                        className="w-full py-3 bg-green-600 text-white rounded-md text-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                        START
                    </button>
                ) : (
                    <p className="text-gray-500 mb-6">Waiting for the leader to start the party...</p>
                )}

                <button
                    onClick={handleLeaveGroup}
                    className="w-full py-3 mt-4 bg-red-600 text-white rounded-md text-lg font-semibold hover:bg-red-700 transition-colors"
                >
                    Leave Group
                </button>

            </div>

            {showQrPopup && qrCodeDataUrl && (
                <QrCodePopup code={groupCode} qrCodeDataUrl={qrCodeDataUrl} onClose={() => setShowQrPopup(false)} />
            )}
        </div>
    );
}