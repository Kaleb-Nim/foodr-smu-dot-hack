"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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
  const flow = searchParams.get("flow"); // 'join' or null

  const handleSelectBlob = () => {
    if (selectedBlob) {
      localStorage.setItem("selectedBlob", selectedBlob);
      if (flow === "join") {
        router.push(`/create-user/name-blob?flow=join`);
      } else {
        router.push("/create-user/name-blob");
      }
    }
  };

<<<<<<< HEAD
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
          Select your Snackr
        </h1>
      </header>
=======
    return (
        <div className="min-h-screen bg-[#252525] flex flex-col">
            <header className="flex items-center p-4 shadow-sm">
                <button onClick={() => router.back()} className="text-gray-600" aria-label="Go back">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-semibold ml-4">Select your Snackr</h1>
            </header>
>>>>>>> edc05a2 (feat: update)

      <div className="flex-grow p-4 grid grid-cols-3 gap-4 justify-items-center items-center bg-[#252525]">
        {blobIcons.map((icon, index) => (
          <div
            key={index}
            className={`w-40 h-40 rounded-xl flex flex-col items-center justify-center aspect-square cursor-pointer ${
              selectedBlob === icon ? "border-4 border-blue-500" : ""
            }`}
            onClick={() => setSelectedBlob(icon)}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={icon}
                alt={`Blob ${index + 1}`}
                fill
                objectFit="contain"
              />
            </div>
          </div>
        ))}
      </div>

<<<<<<< HEAD
      <div className="p-4 bg-[#BAF6F0] border-t shadow-lg">
        <button
          onClick={handleSelectBlob}
          disabled={!selectedBlob}
          className={`w-full py-3 rounded-md text-lg font-semibold hover:-translate-y-2 transition duration-400 hover:shadow-lg shadow-[#033624] ${
            selectedBlob
              ? "bg-[#F1204A] text-white active:text-[#F1204A] active:bg-white border-2 border-[#F1204A]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Select Snackr
        </button>
      </div>
    </div>
  );
}
=======
            <div className="p-4 shadow-lg">
                <Button
                    onClick={handleSelectBlob}
                    disabled={!selectedBlob}
                    className="w-full text-lg font-semibold rounded-md bg-[#F1204A] shadow-lg hover:bg-[#2DCCD3] hover:text-black transition-all duration-500 p-3"
                >
                    Select Snackr
                </Button>
            </div>
        </div>
    );
}
>>>>>>> edc05a2 (feat: update)
