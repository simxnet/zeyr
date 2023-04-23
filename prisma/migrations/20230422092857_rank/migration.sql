/*
  Warnings:

  - Added the required column `userId` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "members" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "rank_accent" TEXT NOT NULL DEFAULT '56c4fb',
ADD COLUMN     "rank_background" TEXT,
ADD COLUMN     "rank_exp" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "rank_level" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "rank_needed_exp" BIGINT NOT NULL DEFAULT 400;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
