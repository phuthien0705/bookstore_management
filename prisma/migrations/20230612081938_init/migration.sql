/*
  Warnings:

  - Added the required column `TenSach` to the `SACH` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sach` ADD COLUMN `TenSach` VARCHAR(255) NOT NULL;
