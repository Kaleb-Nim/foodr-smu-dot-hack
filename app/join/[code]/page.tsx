"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function JoinPage() {
    const params = useParams();
    const groupCode = params.code as string;
    const router = useRouter();

    useEffect(() => {
        if (!groupCode) {
            // If groupCode is missing, display an error or redirect to a page to enter code
            // For now, let's just display a message.
            // In a real app, you might redirect to a generic join page: router.push("/join");
            return; // Stop execution if no group code
        }

        localStorage.setItem('joiningGroupCode', groupCode);
        router.push("/create-user/pick-blob?flow=join");
    }, [groupCode, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
                {groupCode ? (
                    <>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Joining Group...</h2>
                        <p className="text-lg text-gray-700 mb-6">Please wait while we redirect you to avatar selection.</p>
                    </>
                ) : (
                    <>
                        <h2 className="text-3xl font-extrabold text-red-600 mb-4">Error</h2>
                        <p className="text-lg text-gray-700 mb-6">No group code provided. Please ensure you are using a valid join link.</p>
                    </>
                )}
            </div>
        </div>
    );
}