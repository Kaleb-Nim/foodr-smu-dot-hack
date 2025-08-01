/*
  Warnings:

  - You are about to drop the column `leaderId` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the `GroupSwipe` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[leader_id_fk]` on the table `Group` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `leader_id_fk` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."FoodRating" AS ENUM ('SUPER_LIKE', 'LIKE', 'DISLIKE');

-- DropForeignKey
ALTER TABLE "public"."Group" DROP CONSTRAINT "Group_leaderId_fkey";

-- DropIndex
DROP INDEX "public"."Group_leaderId_key";

-- AlterTable
ALTER TABLE "public"."Group" ADD COLUMN "leader_id_fk" TEXT;
UPDATE "public"."Group" SET "leader_id_fk" = "leaderId";
ALTER TABLE "public"."Group" DROP COLUMN "leaderId";
ALTER TABLE "public"."Group" ALTER COLUMN "leader_id_fk" SET NOT NULL;

-- DropTable
DROP TABLE "public"."GroupSwipe";

-- DropEnum
DROP TYPE "public"."SwipePreference";

-- CreateTable
CREATE TABLE "public"."Food" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ratings" (
    "id" TEXT NOT NULL,
    "person_id_fk" TEXT NOT NULL,
    "food_id_fk" TEXT NOT NULL,
    "rating" "public"."FoodRating" NOT NULL DEFAULT 'LIKE',

    CONSTRAINT "Ratings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ratings_person_id_fk_food_id_fk_key" ON "public"."Ratings"("person_id_fk", "food_id_fk");

-- CreateIndex
CREATE UNIQUE INDEX "Group_leader_id_fk_key" ON "public"."Group"("leader_id_fk");

-- AddForeignKey
ALTER TABLE "public"."Group" ADD CONSTRAINT "Group_leader_id_fk_fkey" FOREIGN KEY ("leader_id_fk") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ratings" ADD CONSTRAINT "Ratings_person_id_fk_fkey" FOREIGN KEY ("person_id_fk") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ratings" ADD CONSTRAINT "Ratings_food_id_fk_fkey" FOREIGN KEY ("food_id_fk") REFERENCES "public"."Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
