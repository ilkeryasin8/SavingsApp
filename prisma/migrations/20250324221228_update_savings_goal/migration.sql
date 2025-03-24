/*
  Warnings:

  - You are about to drop the column `userId` on the `SavingsGoal` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SavingsGoal" DROP CONSTRAINT "SavingsGoal_userId_fkey";

-- AlterTable
ALTER TABLE "SavingsGoal" DROP COLUMN "userId";

-- DropTable
DROP TABLE "User";
