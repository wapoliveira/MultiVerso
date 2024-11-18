/*
  Warnings:

  - You are about to drop the column `userId` on the `viewnews` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `viewnews` DROP FOREIGN KEY `ViewNews_userId_fkey`;

-- AlterTable
ALTER TABLE `viewnews` DROP COLUMN `userId`;
