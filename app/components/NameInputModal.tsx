"use client";

import React, { useState, useEffect } from "react";

interface NameInputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveName: (name: string) => void;
    initialName: string;
}

const NameInputModal: React.FC<NameInputModalProps> = ({ isOpen, onClose, onSaveName, initialName }) => {
    const [name, setName] = useState(initialName);

    useEffect(() => {
        setName(initialName);
    }, [initialName]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (name.trim()) {
            onSaveName(name.trim());
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center relative">
                <h3 className="text-xl font-bold mb-4">Enter Your Name</h3>
                <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                />
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    disabled={!name.trim()}
                >
                    Save Name
                </button>
            </div>
        </div>
    );
};

export default NameInputModal;