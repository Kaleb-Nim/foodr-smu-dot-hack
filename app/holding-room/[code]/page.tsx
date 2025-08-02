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

    const userId =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;

    const checkGroupStatus = async () => {
      try {
        const res = await fetch(`/api/groups/${groupCode}/has-started`);
        const data = await res.json();

        if (res.ok && data.hasStarted) {
          if (userId) {
            router.push(`/swipe?groupId=${groupCode}&userId=${userId}`);
          } else {
            setMessage("User ID not found. Cannot redirect to swipe page.");
          }
          return true; // Indicate that redirection happened
        } else if (!res.ok) {
          setMessage(
            `Error checking group status: ${data.error || "Unknown error"}`
          );
        }
      } catch (err) {
        console.error("Failed to check group status:", err);
        setMessage("Failed to check group status.");
      }
      return false; // Indicate no redirection
    };

    const fetchMembers = async () => {
      try {
        const res = await fetch(`/api/groups/${groupCode}/members`);
        const data: GroupData = await res.json();
        if (res.ok) {
          setMembers(data.members || []);
          setGroupName(data.name || "");
          setLeaderId(data.leaderId || null);
        } else {
          setMessage(
            `Error fetching members: ${data.error || "Unknown error"}`
          );
        }
      } catch (err) {
        console.error(err);
        setMessage("Failed to fetch members.");
      }
    };

    const generateQr = async () => {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const joinUrl = `${baseUrl}/join/${groupCode}`;
      try {
        const url = await QRCode.toDataURL(joinUrl);
        setQrCodeDataUrl(url);
      } catch (err) {
        console.error(err);
        setMessage("Failed to generate QR code.");
      }
    };

    // Initial fetches
    fetchMembers();
    generateQr();

    // Polling for group status and members
    const intervalId = setInterval(async () => {
      const redirected = await checkGroupStatus();
      if (!redirected) {
        fetchMembers();
      } else {
        clearInterval(intervalId); // Stop polling if redirected
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(intervalId);
  }, [groupCode, router]);

  const handleStartParty = async () => {
    const userId =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (!userId) {
      setMessage(
        "User ID not found or not in browser environment. Cannot start party."
      );
      return;
    }

    try {
      const res = await fetch(`/api/groups/${groupCode}/start-party`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Party started successfully!");
        // Polling in useEffect will handle redirection
      } else {
        setMessage(`Error starting party: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to start party.");
    }
  };

  const handleLeaveGroup = async () => {
    const userId =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (!userId) {
      setMessage(
        "User ID not found or not in browser environment. Cannot leave group.");
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
    <div className="min-h-screen flex flex-col bg-[#252525]">
      {/* Header */}
      <header className="flex items-center bg-[#BAF6F0] justify-between shadow-sm py-4 px-6">
        {/* Logo */}

        <img
          src="/images/logo_foodr (2).png"
          alt="SHIOK"
          className="h-16 w-auto rounded-lg"
        />

        {/* Room Code */}

        {/* Group Label */}
      </header>

      {/* Main content */}
      <div className="flex-grow flex flex-col p-4 relative">
        {message && <p className="mb-4 text-red-600 text-center">{message}</p>}

        <div className="flex-auto flex justify-center sticky top-1.5 z-50">
          <button
            onClick={() => setShowQrPopup(true)}
            className="flex items-center bg-[#F1204A] rounded-full px-5 py-3 shadow-lg cursor-pointer"
            aria-label="Room info"
          >
            <span className="text-lg font-semibold text-[#e9e9e9]">
              QR Code: {groupCode}
            </span>
          </button>
        </div>

        <span className="text-center text-lg font-semibold mr-1 text-[#e9e9e9]">
            Group: {groupName}
        </span>

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

        <div className="h-[50px]"/>

        {/* Action button at bottom center */}
        <div className="fixed inset-x-0 bottom-0">
          <div className="mt-auto flex justify-center mb-6">
            {leaderId &&
            typeof window !== "undefined" &&
            leaderId === localStorage.getItem("userId") ? (
              <button
                onClick={handleStartParty}
                className="w-full max-w-xs py-3 text-lg font-semibold rounded-md bg-[#F1204A] text-white active:bg-white active:text-[#F1204A] border-2 border-[#F1204A] transition duration-400"
              >
                Start Group
              </button>
            ) : (
              <button
                onClick={handleLeaveGroup}
                className="w-full max-w-xs py-3 text-lg font-semibold rounded-md bg-[#F1204A] text-white active:bg-white active:text-[#F1204A] border-2 border-[#F1204A] transition duration-400"
              >
                Leave Group
              </button>
            )}
          </div>
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
