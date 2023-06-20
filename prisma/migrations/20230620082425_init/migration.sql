/*
  Warnings:

  - The primary key for the `baocaocongno` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `baocaoton` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX `BAOCAOCONGNO_MaKH_Thang_Nam_key` ON `baocaocongno`;

-- DropIndex
DROP INDEX `BAOCAOTON_MaSach_Thang_Nam_key` ON `baocaoton`;

-- AlterTable
ALTER TABLE `baocaocongno` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`MaKH`, `Thang`, `Nam`);

-- AlterTable
ALTER TABLE `baocaoton` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`MaSach`, `Thang`, `Nam`);
