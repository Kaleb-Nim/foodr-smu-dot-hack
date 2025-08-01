import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const groups = pgTable("afterproject_groups", {
    id: serial("id").primaryKey(),
    code: text("code").notNull().unique(),
    members: jsonb("members").default([]).notNull(), // Stores an array of { id: string, name: string }
    createdAt: timestamp("created_at").defaultNow().notNull(),
});