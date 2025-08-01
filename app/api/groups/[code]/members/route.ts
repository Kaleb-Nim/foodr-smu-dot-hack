import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { code: string } }) {
    try {
        console.log("Received params:", await params); // Debugging
        const code = (await params).code;

        if (!code) {
            return NextResponse.json({ error: "Group code is required" }, { status: 400 });
        }

        const group = await prisma.group.findFirst({
            where: { code: code },
            include: { members: true },
        });

        if (!group) {
            return NextResponse.json({ error: "Group not found" }, { status: 404 });
        }

        return NextResponse.json({
            name: group.name,
            leaderId: group.leader_id_fk,
            members: group.members
        });
    } catch (error) {
        console.error("Error fetching group members:", error);
        return NextResponse.json({ error: "Failed to fetch group members" }, { status: 500 });
    }
}