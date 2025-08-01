import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { groups } from "@/src/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(request: Request) {
    try {
        const { code, userName } = await request.json();

        if (!code || !userName) {
            return NextResponse.json({ error: "Group code and user name are required" }, { status: 400 });
        }

        const existingGroup = await db.transaction(async (tx) => {
            const group = await tx.query.groups.findFirst({
                where: (groups, { eq }) => eq(groups.code, code),
            });

            if (!group) {
                return null; // Group not found
            }

            const currentMembers = group.members as { id: string; name: string }[];

            // Generate a new unique ID for the user joining
            const newUserId = `user-${Math.random().toString(36).substring(2, 9)}`; // Simple unique ID generation

            // Check if user is already in the group (by name, or if you want to track by a persistent ID, you'd need that from the client)
            if (currentMembers.some(member => member.name === userName)) {
                // If a user with the same name exists, you might want to handle this differently
                // For now, let's assume unique names or allow duplicates for simplicity
                // Or, if you want to prevent duplicates, return an error:
                // return NextResponse.json({ error: "User with this name already exists in the group" }, { status: 409 });
            }

            const updatedMembers = [...currentMembers, { id: newUserId, name: userName }];

            await tx.update(groups)
                .set({ members: updatedMembers })
                .where(eq(groups.code, code));

            return { ...group, members: updatedMembers, newUserId }; // Return updated group and newUserId
        });

        if (!existingGroup) {
            return NextResponse.json({ success: false, message: "Invalid group code" }, { status: 404 });
        }

        // Extract newUserId from existingGroup if it was set during the transaction
        const userIdToReturn = existingGroup.newUserId;

        // WebSocket notification is now handled by the client-side Socket.IO emit
        // when the join is successful. The server-side API no longer needs to send HTTP notification.

        // Redirect to holding room
        return NextResponse.json({ success: true, message: "Group joined successfully", redirectUrl: `/holding-room/${code}?userName=${userName}`, userId: userIdToReturn });
    } catch (error) {
        console.error("Error joining group:", error);
        return NextResponse.json({ error: "Failed to join group" }, { status: 500 });
    }
}