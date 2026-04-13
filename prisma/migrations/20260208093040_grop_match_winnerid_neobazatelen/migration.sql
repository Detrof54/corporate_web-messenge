-- AlterTable
ALTER TABLE "public"."BracketMatchResult" ALTER COLUMN "winnerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."GroupMatchResult" ALTER COLUMN "winnerId" DROP NOT NULL;
