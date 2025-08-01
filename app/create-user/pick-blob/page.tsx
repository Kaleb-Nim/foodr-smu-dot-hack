"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const blobIcons = [
    "/images/blob1.png",
    "/images/blob2.png",
    "/images/blob3.png",
    "/images/blob4.png",
    "/images/blob5.png",
    "/images/blob6.png",
    "/images/blob7.png",
    "/images/blob8.png",
    "/images/blob9.png",
];

export default function PickBlobPage() {
    const router = useRouter();
    const [selectedBlob, setSelectedBlob] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const flow = searchParams.get('flow'); // 'join' or null

    const handleSelectBlob = () => {
        if (selectedBlob) {
            localStorage.setItem("selectedBlob", selectedBlob);
            if (flow === 'join') {
                router.push(`/create-user/name-blob?flow=join`);
            } else {
                router.push("/create-user/name-blob");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="flex items-center p-4 bg-white shadow-sm">
                <button onClick={() => router.back()} className="text-gray-600" aria-label="Go back">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-semibold ml-4">Select your Snackr</h1>
            </header>

            <div className="flex-grow p-4 grid grid-cols-3 gap-4 justify-items-center items-center">
                {blobIcons.map((icon, index) => (
                    <div
                        key={index}
                        className={`w-40 h-40 rounded-xl flex flex-col items-center justify-center aspect-square cursor-pointer ${selectedBlob === icon ? "border-4 border-blue-500" : ""}`}
                        onClick={() => setSelectedBlob(icon)}
                    >
                        <div className="relative w-full h-full flex items-center justify-center">
                            <Image src={icon} alt={`Blob ${index + 1}`} fill objectFit="contain" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-white border-t shadow-lg">
                <button
                    onClick={handleSelectBlob}
                    disabled={!selectedBlob}
                    className={`w-full py-3 rounded-md text-lg font-semibold transition-colors ${
                        selectedBlob ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                    Select Snackr
                </button>
            </div>
        </div>
    );
}