import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { groups } from "@/src/db/schema";
import QRCode from "qrcode";
import { sql } from "drizzle-orm";

function generateRandomCode(length: number) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export async function POST(request: Request) {
    try {
        const { userName } = await request.json();

        if (!userName) {
            return NextResponse.json({ error: "User name is required" }, { status: 400 });
        }

        let code: string = "";
        let isUnique = false;
        while (!isUnique) {
            code = generateRandomCode(6);
            const existingGroup = await db.query.groups.findFirst({
                where: (groups, { eq }) => eq(groups.code, code),
            });
            if (!existingGroup) {
                isUnique = true;
            }
        }

        // Generate a new unique ID for the creator
        const creatorId = `user-${Math.random().toString(36).substring(2, 9)}`;

        // Insert new group with the creator as the first member
        await db.insert(groups).values({
            code: code,
            members: [{ id: creatorId, name: userName }],
        });

        // WebSocket notification is now handled by the client-side Socket.IO emit
        // when the group is created successfully. The server-side API no longer needs to send HTTP notification.

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const joinUrl = `${baseUrl}/join/${code}`;
        const qrCodeDataUrl = await QRCode.toDataURL(joinUrl);

        // Redirect to holding room
        return NextResponse.json({ code, qrCodeDataUrl, redirectUrl: `/holding-room/${code}?userName=${userName}`, userId: creatorId });
    } catch (error) {
        console.error("Error creating group:", error);
        return NextResponse.json({ error: "Failed to create group" }, { status: 500 });
    }
}