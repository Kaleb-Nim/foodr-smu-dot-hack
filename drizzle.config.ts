import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

export default defineConfig({
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.POSTGRES_URL as string
    },
    schema: "./src/db/schema.ts",
    tablesFilter: ["afterproject_*"]
});