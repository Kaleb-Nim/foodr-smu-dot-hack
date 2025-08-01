import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { code, userName, blobIcon } = await request.json();

        if (!code || !userName) {
            return NextResponse.json({ error: "Group code and user name are required" }, { status: 400 });
        }

        const existingGroup = await prisma.$transaction(async (tx) => {
            const group = await tx.group.findFirst({
                where: { code: code },
                include: { members: true }, // Include members to update them
            });

            if (!group) {
                return null; // Group not found
            }

            const currentMembers = group.members;

            // Create the new user
            const newUser = await tx.user.create({
                data: {
                    name: userName,
                    blobIcon: blobIcon,
                },
            });

            // Check if user is already in the group (by name, or if you want to track by a persistent ID, you'd need that from the client)
            // Check if user is already in the group (by name)
            if (currentMembers.some(member => member.name === userName)) {
                // If a user with the same name exists, you might want to handle this differently
                // For now, let's assume unique names or allow duplicates for simplicity
                // Or, if you want to prevent duplicates, return an error:
                // await tx.user.delete({ where: { id: newUser.id } }); // Rollback user creation
                // return NextResponse.json({ error: "User with this name already exists in the group" }, { status: 409 });
            }

            // Connect the new user to the group
            await tx.group.update({
                where: { id: group.id },
                data: {
                    members: {
                        connect: { id: newUser.id },
                    },
                },
            });

            return { ...group, newUserId: newUser.id }; // Return updated group and newUserId
        });

        if (!existingGroup) {
            return NextResponse.json({ success: false, message: "Invalid group code" }, { status: 404 });
        }

        // Extract newUserId from existingGroup if it was set during the transaction
        const userIdToReturn = existingGroup.newUserId;

        // WebSocket notification is now handled by the client-side Socket.IO emit
        // when the join is successful. The server-side API no longer needs to send HTTP notification.

        // Redirect to holding room
        return NextResponse.json({ success: true, message: "Group joined successfully", redirectUrl: `/holding-room/${code}?userName=${userName}&blobIcon=${blobIcon}`, userId: userIdToReturn });
    } catch (error) {
        console.error("Error joining group:", error);
        return NextResponse.json({ error: "Failed to join group" }, { status: 500 });
    }
}