import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import QRCode from "qrcode";

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
        console.log("Received request to create group.");
        const { userName, groupName, blobIcon } = await request.json();
        console.log("Request body:", { userName, groupName, blobIcon });

        if (!userName || !groupName) {
            console.log("Missing userName or groupName.");
            return NextResponse.json({ error: "User name and group name are required" }, { status: 400 });
        }

        let code: string = "";
        let isUnique = false;
        while (!isUnique) {
            code = generateRandomCode(6);
            const existingGroup = await prisma.group.findFirst({
                where: { code: code },
            });
            if (!existingGroup) {
                isUnique = true;
            }
        }

        // Generate a new unique ID for the creator
        const creatorId = `user-${Math.random().toString(36).substring(2, 9)}`;

        // Insert new group with the creator as the first member
        console.log("Attempting to insert new group with code:", code);
        const newLeader = await prisma.user.create({
            data: {
                id: creatorId,
                name: userName,
                blobIcon: blobIcon,
            },
        });

        await prisma.group.create({
            data: {
                code: code,
                name: groupName,
                leader_id_fk: newLeader.id,
                members: {
                    connect: { id: newLeader.id },
                },
            },
        });
        console.log("Group inserted successfully into DB.");

        // WebSocket notification is now handled by the client-side Socket.IO emit
        // when the group is created successfully. The server-side API no longer needs to send HTTP notification.

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const joinUrl = `${baseUrl}/join/${code}`;
        const qrCodeDataUrl = await QRCode.toDataURL(joinUrl);

        // Redirect to holding room
        return NextResponse.json({ code, qrCodeDataUrl, redirectUrl: `/holding-room/${code}?userName=${userName}&blobIcon=${blobIcon}`, userId: creatorId });
    } catch (error) {
        console.error("Error creating group:", error);
        return NextResponse.json({ error: "Failed to create group" }, { status: 500 });
    }
}