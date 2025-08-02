"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (groupName: string, leaderName: string) => void;
  initialUserName: string;
}

export default function CreateGroupModal({
  isOpen,
  onClose,
  onCreateGroup,
  initialUserName,
}: CreateGroupModalProps) {
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
    <div
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300",
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      )}
    >
      <div
        className={clsx(
          "absolute inset-0 bg-black transition-opacity duration-300",
          isOpen ? "opacity-90" : "opacity-0"
        )}
        onClick={onClose} // Click outside closes modal
      />

      <div
        className={clsx(
          "relative z-10 bg-white p-6 rounded-lg shadow-xl w-full max-w-sm transform transition-all duration-300",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-[#002F5A]">
          Create New Party
        </h2>
        <div className="mb-4">
          <label
            htmlFor="groupName"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
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
        <div className="flex items-center justify-between">
          <button
            onClick={handleSubmit}
            className="bg-[#F1204A] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Next
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
