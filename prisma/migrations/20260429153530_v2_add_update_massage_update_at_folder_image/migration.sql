/*
  Warnings:

  - You are about to drop the column `image` on the `Folder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Folder" DROP COLUMN "image";

-- AlterTable
ALTER TABLE "public"."Message" ADD COLUMN     "updateAt" TIMESTAMP(3);
