CREATE TABLE "afterproject_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "afterproject_groups_code_unique" UNIQUE("code")
);
