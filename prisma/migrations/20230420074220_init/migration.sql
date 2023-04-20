/*
  Warnings:

  - You are about to drop the `bookauthor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bookcategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `authorId` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `bookauthor` DROP FOREIGN KEY `BookAuthor_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `bookauthor` DROP FOREIGN KEY `BookAuthor_bookId_fkey`;

-- DropForeignKey
ALTER TABLE `bookcategory` DROP FOREIGN KEY `BookCategory_bookId_fkey`;

-- DropForeignKey
ALTER TABLE `bookcategory` DROP FOREIGN KEY `BookCategory_categoryId_fkey`;

-- AlterTable
ALTER TABLE `book` ADD COLUMN `authorId` INTEGER NOT NULL,
    ADD COLUMN `categoryId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `bookauthor`;

-- DropTable
DROP TABLE `bookcategory`;

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `Book_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `Author`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `Book_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
