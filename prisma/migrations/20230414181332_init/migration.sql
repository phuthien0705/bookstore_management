/*
  Warnings:

  - You are about to drop the `categoryauthor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `categoryauthor` DROP FOREIGN KEY `CategoryAuthor_bookId_fkey`;

-- DropForeignKey
ALTER TABLE `categoryauthor` DROP FOREIGN KEY `CategoryAuthor_categoryId_fkey`;

-- DropTable
DROP TABLE `categoryauthor`;

-- CreateTable
CREATE TABLE `BookCategory` (
    `bookId` INTEGER NOT NULL,
    `categoryId` INTEGER NOT NULL,

    PRIMARY KEY (`bookId`, `categoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BookCategory` ADD CONSTRAINT `BookCategory_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Book`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookCategory` ADD CONSTRAINT `BookCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
