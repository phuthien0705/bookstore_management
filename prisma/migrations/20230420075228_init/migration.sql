/*
  Warnings:

  - You are about to drop the `example` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `book` DROP FOREIGN KEY `Book_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `book` DROP FOREIGN KEY `Book_categoryId_fkey`;

-- AlterTable
ALTER TABLE `book` MODIFY `authorId` INTEGER NULL,
    MODIFY `categoryId` INTEGER NULL;

-- DropTable
DROP TABLE `example`;

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `Book_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `Author`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `Book_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
