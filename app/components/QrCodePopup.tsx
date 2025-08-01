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
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                    &times;
                </button>
                <h3 className="text-3xl font-bold mb-4">Party Code: {code}</h3>
                {qrCodeDataUrl && (
                    <Image src={qrCodeDataUrl} alt="QR Code" width={300} height={300} className="mx-auto mb-4" />
                )}
                <p className="text-lg font-semibold mb-4">Scan to Join</p>
                <button
                    onClick={() => navigator.clipboard.writeText(code)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Copy Code
                </button>
            </div>
        </div>
    );
};

export default QrCodePopup;