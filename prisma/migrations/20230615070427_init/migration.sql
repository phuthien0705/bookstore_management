/*
  Warnings:

  - You are about to drop the column `ThanTien` on the `ct_hoadon` table. All the data in the column will be lost.
  - Added the required column `ThanhTien` to the `CT_HOADON` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ct_hoadon` DROP COLUMN `ThanTien`,
    ADD COLUMN `ThanhTien` DECIMAL(65, 30) NOT NULL;
