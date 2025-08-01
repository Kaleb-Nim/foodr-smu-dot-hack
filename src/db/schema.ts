import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const groups = pgTable("afterproject_groups", {
    id: serial("id").primaryKey(),
    code: text("code").notNull().unique(),
    name: text("name").notNull(), // New field for group name
    leaderId: text("leader_id").notNull(), // New field for leader ID
    members: jsonb("members").default([]).notNull(), // Stores an array of { id: string, name: string }
    createdAt: timestamp("created_at").defaultNow().notNull(),
});