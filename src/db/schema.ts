import { pgTable, serial, text, timestamp, jsonb, pgEnum, unique } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const groups = pgTable("afterproject_groups", {
    id: serial("id").primaryKey(),
    code: text("code").notNull().unique(),
    name: text("name").notNull(), // New field for group name
    leaderId: text("leader_id").notNull(), // New field for leader ID
    members: jsonb("members").default([]).notNull(), // Stores an array of { id: string, name: string }
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- lol i vibe coded the schema for the swipe feature ---

// 1. UPDATED: Simplified enum for swipe preferences
export const swipePreferenceEnum = pgEnum('swipe_preference', ['like', 'dislike']);

export const users = pgTable("users", {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    name: text('name'),
});

export const dishes = pgTable("dishes", {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    name: text('name').notNull(),
    image: text('image'),
    description: text('description'),
});

// 2. The new 'groupSwipes' table, ready for your database
export const groupSwipes = pgTable("group_swipes", {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    preference: swipePreferenceEnum('preference').notNull(),

    // --- Relations ---
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    dishId: text('dish_id').notNull().references(() => dishes.id, { onDelete: 'cascade' }),
    sessionId: text('session_id').notNull().references(() => groups.id, { onDelete: 'cascade' }),

}, (table) => {
    // Unique constraint to handle re-swipes correctly
    return {
        uniqueSwipe: unique().on(table.userId, table.dishId, table.sessionId),
    };
});