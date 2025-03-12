/*
  Warnings:

  - You are about to drop the column `accountId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `accountId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[flowerAccountId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `flowerAccountId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_accountId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_accountId_fkey";

-- DropIndex
DROP INDEX "User_accountId_key";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "accountId",
ADD COLUMN     "flowerAccountId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "accountId",
ADD COLUMN     "flowerAccountId" TEXT;

-- DropTable
DROP TABLE "Account";

-- CreateTable
CREATE TABLE "FlowerAccount" (
    "id" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "FlowerAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_flowerAccountId_key" ON "User"("flowerAccountId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_flowerAccountId_fkey" FOREIGN KEY ("flowerAccountId") REFERENCES "FlowerAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_flowerAccountId_fkey" FOREIGN KEY ("flowerAccountId") REFERENCES "FlowerAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
