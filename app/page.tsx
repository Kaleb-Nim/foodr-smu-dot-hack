"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import GroupManager from './components/GroupManager';
import CreateGroupModal from './components/CreateGroupModal';

export default function Home() {
  const [mode, setMode] = useState<'none' | 'create' | 'join'>('none');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userName, setUserName] = useState(''); // State to hold user name for modal
  const [currentGroupName, setCurrentGroupName] = useState(''); // State to hold group name for GroupManager

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const handleCreatePartyClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateGroup = (groupName: string, leaderName: string) => {
    localStorage.setItem('userName', leaderName); // Save leader's name
    setUserName(leaderName);
    setIsCreateModalOpen(false);
    setCurrentGroupName(groupName); // Store group name in state
    setMode('create'); // Set mode to 'create' to render GroupManager
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md">
        <div className="bg-purple-700 text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Swipe with Friends</h1>
          {/* Placeholder for SHIOK logo */}
          <img src="https://i.imgur.com/l3ty4QJ.png" alt="SHIOK" className="h-8 w-auto" />
        </div>

        <div className="bg-yellow-400 p-6">
          <h2 className="text-lg font-bold mb-4">Party Mode</h2>
          <div className="space-y-4">
            <button
              onClick={handleCreatePartyClick}
              className="w-full py-3 bg-blue-800 text-white rounded-md text-lg font-semibold hover:bg-blue-900 transition-colors"
            >
              Start Party
            </button>
            <button
              onClick={() => setMode('join')}
              className="w-full py-3 bg-blue-800 text-white rounded-md text-lg font-semibold hover:bg-blue-900 transition-colors"
            >
              Join Party
            </button>
          </div>
        </div>

        {mode !== 'none' && (
          <div className="p-6 bg-white">
            <GroupManager initialMode={mode} onBack={() => setMode('none')} userName={userName} groupName={currentGroupName} />
          </div>
        )}

        <CreateGroupModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateGroup={handleCreateGroup}
          initialUserName={userName}
        />

        <div className="p-4 text-center bg-gray-200">
          <Link href="/map" className="text-blue-600 hover:underline">
            Go to Food Map
          </Link>
        </div>
      </div>
    </div>
  );
}
