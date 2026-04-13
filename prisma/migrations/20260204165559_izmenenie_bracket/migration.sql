/*
  Warnings:

  - Made the column `bracketMatchId` on table `BracketMatchResult` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."BracketMatchResult" DROP CONSTRAINT "BracketMatchResult_bracketMatchId_fkey";

-- DropIndex
DROP INDEX "public"."BracketMatchResult_bracketMatchId_key";

-- AlterTable
ALTER TABLE "public"."BracketMatchResult" ALTER COLUMN "bracketMatchId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."BracketMatchResult" ADD CONSTRAINT "BracketMatchResult_bracketMatchId_fkey" FOREIGN KEY ("bracketMatchId") REFERENCES "public"."BracketMatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
