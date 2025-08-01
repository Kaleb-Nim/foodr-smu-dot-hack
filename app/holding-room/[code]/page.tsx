"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import QRCode from "qrcode";
import Image from "next/image";
import QrCodePopup from "@/app/components/QrCodePopup";

interface Member {
  id: string;
  name: string;
  blobIcon: string;
}

interface GroupData {
  name?: string;
  leaderId?: string;
  members?: Member[];
  error?: string;
}

export default function HoldingRoomPage() {
  const params = useParams();
  const router = useRouter();
  const groupCode = params.code as string;

  const [members, setMembers] = useState<Member[]>([]);
  const [groupName, setGroupName] = useState<string>("");
  const [leaderId, setLeaderId] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [showQrPopup, setShowQrPopup] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!groupCode) {
      setMessage("No group code provided.");
      return;
    }

    const fetchMembers = async () => {
      try {
        const res = await fetch(`/api/groups/${groupCode}/members`);
        const data: GroupData = await res.json();
        if (res.ok) {
          setMembers(data.members || []);
          setGroupName(data.name || "");
          setLeaderId(data.leaderId || null);
        } else {
          setMessage(`Error fetching members: ${data.error || "Unknown error"}`);
        }
      } catch (err) {
        console.error(err);
        setMessage("Failed to fetch members.");
      }
    };

    const generateQr = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const joinUrl = `${baseUrl}/join/${groupCode}`;
      try {
        const url = await QRCode.toDataURL(joinUrl);
        setQrCodeDataUrl(url);
      } catch (err) {
        console.error(err);
        setMessage("Failed to generate QR code.");
      }
    };

    fetchMembers();
    generateQr();
    const intervalId = setInterval(fetchMembers, 3000);
    return () => clearInterval(intervalId);
  }, [groupCode]);

  const handleStartParty = () => router.push(`/map?partyId=${groupCode}`);

  const handleLeaveGroup = async () => {
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (!userId) {
      setMessage("User ID not found or not in browser environment. Cannot leave group.");
      return;
    }
    try {
      const res = await fetch(`/api/groups/${groupCode}/members/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Successfully left the group.");
        localStorage.removeItem("userId");
        router.push("/");
      } else {
        setMessage(`Error leaving group: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to leave group.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="flex items-center bg-white shadow-sm py-4 px-6">
        {/* Logo */}
        <div className="flex-none">
          <Image
            src="/images/foodr_logo_horizontal_2.png"
            alt="Foodr Logo"
            width={80}
            height={24}
          />
        </div>

        {/* Room Code */}
        <div className="flex-auto flex justify-center">
          <button
            onClick={() => setShowQrPopup(true)}
            className="flex items-center bg-gray-200 rounded-full px-4 py-2"
            aria-label="Room info"
          >
            <span className="text-sm font-semibold mr-2">ROOM CODE</span>
            <span className="text-lg font-bold text-blue-600">{groupCode}</span>
          </button>
        </div>

        {/* Group Label */}
        <div className="flex-none flex justify-end items-center">
          <span className="text-sm font-semibold mr-1">GROUP:</span>
          <span className="text-lg font-bold text-blue-600">{groupName}</span>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-grow flex flex-col p-4">
        {message && (
          <p className="mb-4 text-red-600 text-center">{message}</p>
        )}

        {/* Members grid: 1 column on xs, 2 on md, 3 on lg, vertical first then horizontal, scroll if overflow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-6 mb-6 overflow-y-auto">
          {members.map((m) => (
            <div key={m.id} className="flex flex-col items-center px-4">
              <div className="w-32 h-32 mb-4 relative">
                <Image
                  src={m.blobIcon}
                  alt={m.name}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-lg font-medium">{m.name}</p>
            </div>
          ))}
        </div>

        {/* Action button at bottom center */}
        <div className="mt-auto flex justify-center mb-6">
          {leaderId && typeof window !== "undefined" && leaderId === localStorage.getItem("userId") ? (
            <button
              onClick={handleStartParty}
              className="w-full max-w-xs py-3 text-lg font-semibold rounded-md bg-pink-500 text-white hover:bg-pink-600"
            >
              Start Group
            </button>
          ) : (
            <button
              onClick={handleLeaveGroup}
              className="w-full max-w-xs py-3 text-lg font-semibold rounded-md bg-red-500 text-white hover:bg-red-600"
            >
              Leave Group
            </button>
          )}
        </div>
      </div>

      {/* QR Code Popup */}
      {showQrPopup && qrCodeDataUrl && (
        <QrCodePopup
          code={groupCode}
          qrCodeDataUrl={qrCodeDataUrl}
          onClose={() => setShowQrPopup(false)}
        />
      )}
    </div>
  );
}
