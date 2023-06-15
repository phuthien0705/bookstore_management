/*
  Warnings:

  - You are about to drop the column `SoLuongTonToiThieu` on the `thamchieu` table. All the data in the column will be lost.
  - Added the required column `SoLuongTonToiDa` to the `THAMCHIEU` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `thamchieu` DROP COLUMN `SoLuongTonToiThieu`,
    ADD COLUMN `SoLuongTonToiDa` INTEGER NOT NULL;
