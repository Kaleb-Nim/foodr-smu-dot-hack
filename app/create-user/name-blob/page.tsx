"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const suggestedNames = [
  "Excited",
  "Iconic",
  "Cute",
  "Happy",
  "Weird",
  "Spiky",
  "Awkward",
  "Spooky",
  "Cool",
  "Blob",
  "Tomato",
  "Ghost",
  "Sassy",
  "Weird",
  "Flower",
];

export default function NameBlobPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const flow = searchParams.get("flow"); // 'join' or null
  const [blobIcon, setBlobIcon] = useState<string | null>(null);
  const [blobName, setBlobName] = useState<string>("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedBlob = localStorage.getItem("selectedBlob");
    if (storedBlob) {
      setBlobIcon(storedBlob);
    } else {
      // Redirect if no blob is selected
      router.push("/create-user/pick-blob");
    }
  }, [router]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBlobName(e.target.value);
  };

  const handleAction = async () => {
    if (!blobIcon || !blobName) {
      setMessage("Please select an avatar and enter a name.");
      return;
    }

    localStorage.setItem("userName", blobName);
    localStorage.setItem("userBlobIcon", blobIcon);

    if (flow === "join") {
      const groupCode = localStorage.getItem("joiningGroupCode");
      if (!groupCode) {
        setMessage("No group code found for joining.");
        return;
      }

      setMessage("Attempting to join group...");
      try {
        const response = await fetch("/api/groups/join", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: groupCode,
            userName: blobName,
            blobIcon,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem("userId", data.userId);
          localStorage.removeItem("joiningGroupCode"); // Clean up
          router.push(data.redirectUrl);
        } else {
          setMessage(`Error joining group: ${data.message}`);
        }
      } catch (error) {
        console.error("Failed to join group:", error);
        setMessage("Failed to connect to server to join group.");
      }
    } else {
      // Original create group flow
      const storedGroupName = localStorage.getItem("newGroupName");
      if (!storedGroupName) {
        setMessage("No group name found for creation.");
        return;
      }

      setMessage("Attempting to create group...");
      try {
        const response = await fetch("/api/groups/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName: blobName,
            groupName: storedGroupName,
            blobIcon,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        localStorage.setItem("userId", data.userId);
        localStorage.removeItem("newGroupName"); // Clean up
        router.push(data.redirectUrl);
      } catch (error) {
        console.error("Failed to create group:", error);
        setMessage("Failed to connect to server to create group.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center p-4 bg-[#BAF6F0] shadow-sm">
        <button
          onClick={() => router.back()}
          className="text-gray-600 active:bg-[#F1204A] rounded-2xl p-1 active:text-white transition duration-400"
          aria-label="Go back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-xl font-semibold ml-4 text-[#252525]">
          Name your Snackr
        </h1>
      </header>

      <div className="flex-grow p-4 flex flex-col items-center justify-center bg-[#252525]">
        {blobIcon && (
          <Image
            src={blobIcon}
            alt="Selected Blob"
            width={150}
            height={150}
            className="mb-4"
            objectFit="contain"
          />
        )}
        <h2 className="text-2xl font-bold mb-4">Your Snackr Name</h2>

        <input
          type="text"
          placeholder="Enter your Snackr name"
          value={blobName}
          onChange={handleNameChange}
          className="w-full max-w-md p-3 border border-gray-300 rounded-md text-center text-lg mx-auto mt-4"
        />
      </div>

      <div className="p-4 border-t shadow-lg bg-[#BAF6F0] ">
        <p className="text-red-500 text-sm mb-4">{message}</p>

        <button
          onClick={handleAction}
          disabled={!blobName || !blobIcon}
          className={`w-full py-3 rounded-md text-lg font-semibold hover:-translate-y-2 transition duration-400 hover:shadow-lg shadow-[#033624] ${
            blobName && blobIcon
              ? "bg-[#F1204A] text-white active:text-[#F1204A] active:bg-white border-2 border-[#F1204A]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {flow === "join" ? "Join Group" : "Start Party"}
        </button>
      </div>
    </div>
  );
}
