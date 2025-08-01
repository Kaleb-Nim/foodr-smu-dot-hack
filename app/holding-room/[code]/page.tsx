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

export default function HoldingRoomPage() {
    const params = useParams();
    const router = useRouter();
    const groupCode = params.code as string;
    const searchParams = useSearchParams();
    const initialUserName = searchParams.get('userName') || 'Guest';
    const [members, setMembers] = useState<Member[]>([]);
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
                const response = await fetch(`/api/groups/${groupCode}/members`); // New API route to fetch members
                const data = await response.json();
                if (response.ok) {
                    setMembers(data.members || []);
                } else {
                    setMessage(`Error fetching members: ${data.error}`);
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

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                <h1 className="text-2xl font-bold mb-6">Holding Room</h1>
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

                <button
                    onClick={handleStartParty}
                    className="w-full py-3 bg-green-600 text-white rounded-md text-lg font-semibold hover:bg-green-700 transition-colors"
                >
                    START
                </button>
            </div>

            {showQrPopup && qrCodeDataUrl && (
                <QrCodePopup code={groupCode} qrCodeDataUrl={qrCodeDataUrl} onClose={() => setShowQrPopup(false)} />
            )}
        </div>
    );
}