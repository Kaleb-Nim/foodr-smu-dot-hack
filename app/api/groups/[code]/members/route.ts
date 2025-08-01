import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { groups } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request, { params }: { params: { code: string } }) {
    try {
        console.log("Received params:", await params); // Debugging
        const code = (await params).code;

        if (!code) {
            return NextResponse.json({ error: "Group code is required" }, { status: 400 });
        }

        const group = await db.query.groups.findFirst({
            where: (groups, { eq }) => eq(groups.code, code),
        });

        if (!group) {
            return NextResponse.json({ error: "Group not found" }, { status: 404 });
        }

        return NextResponse.json({ members: group.members });
    } catch (error) {
        console.error("Error fetching group members:", error);
        return NextResponse.json({ error: "Failed to fetch group members" }, { status: 500 });
    }
}