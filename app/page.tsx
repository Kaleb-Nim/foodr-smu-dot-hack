"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import GroupManager from "./components/GroupManager";
import CreateGroupModal from "./components/CreateGroupModal";
import JoinGroupModal from "./components/JoinGroupModal";

export default function Home() {
  const [mode, setMode] = useState<"none" | "create" | "join">("none");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [userName, setUserName] = useState(""); // State to hold user name for modal
  const [currentGroupName, setCurrentGroupName] = useState(""); // State to hold group name for GroupManager

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const handleCreatePartyClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateGroup = (groupName: string, leaderName: string) => {
    localStorage.setItem("userName", leaderName); // Save leader's name
    setUserName(leaderName);
    setIsCreateModalOpen(false);
    setCurrentGroupName(groupName); // Store group name in state
    setMode("create"); // Set mode to 'create' to render GroupManager
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#252525] p-6">
      <div className="text-black p-6 flex justify-center items-center">
        {/* Placeholder for SHIOK logo */}
        <img
          src="/images/logo_foodr (2).png"
          alt="SHIOK"
          className="h-24 w-auto rounded-lg mb-4"
        />
      </div>
      <div className="rounded-lg shadow-lg overflow-hidden w-full max-w-md bg-[#FBEB35]">
        <div className="p-7 text-black">
          <div className="space-y-4">
            <button
              onClick={handleCreatePartyClick}
              className="w-full py-3 bg-[#F1204A] text-white rounded-md text-lg font-semibold hover:-translate-y-2 transition duration-400 hover:shadow-lg shadow-[#033624] active:text-[#F1204A] active:bg-white border-2 border-[#F1204A]"
            >
              Start Party
            </button>
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="mt-2 w-full py-3 bg-[#2DCCD3] text-white rounded-md text-lg font-semibold hover:-translate-y-2 transition duration-400 hover:shadow-lg shadow-[#033624] active:text-[#2DCCD3] active:bg-white border-2 border-[#2DCCD3]"
            >
              Join Party
            </button>
          </div>
        </div>

        {mode !== "none" && (
          <div className="p-6 bg-white">
            <GroupManager
              initialMode={mode}
              onBack={() => setMode("none")}
              userName={userName}
              groupName={currentGroupName}
            />
          </div>
        )}

        <CreateGroupModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateGroup={handleCreateGroup}
          initialUserName={userName}
        />

        <JoinGroupModal
          isOpen={isJoinModalOpen}
          onClose={() => setIsJoinModalOpen(false)}
        />
      </div>
    </div>
  );
}
