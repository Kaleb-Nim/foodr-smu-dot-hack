"use client";

import React from "react";
import Image from "next/image";

interface QrCodePopupProps {
    code: string;
    qrCodeDataUrl: string;
    onClose: () => void;
}

const QrCodePopup: React.FC<QrCodePopupProps> = ({ code, qrCodeDataUrl, onClose }) => {
    return (
        <div className="fixed inset-0 bg-[#252525]/75 flex items-center justify-center z-50">
            <div className="bg-[#252525] p-6 rounded-lg shadow-lg text-center relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                    &times;
                </button>
                {qrCodeDataUrl && (
                    <Image src={qrCodeDataUrl} alt="QR Code" width={300} height={300} className="mx-auto mb-4" />
                )}
                <h3 className="text-3xl font-bold mb-4">Party Code: {code}</h3>
                <button
                    onClick={() => navigator.clipboard.writeText(code)}
                    className="px-4 py-2 bg-[#F1204A] text-white rounded-md w-full"
                >
                    Copy Code
                </button>
            </div>
        </div>
    );
};

export default QrCodePopup;