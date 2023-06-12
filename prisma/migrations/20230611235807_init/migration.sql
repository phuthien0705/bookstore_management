/*
  Warnings:

  - You are about to drop the `account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `author` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `book` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bookentryticket` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `config` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sale` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `saledetail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `book` DROP FOREIGN KEY `Book_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `book` DROP FOREIGN KEY `Book_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `bookentryticket` DROP FOREIGN KEY `BookEntryTicket_accountId_fkey`;

-- DropForeignKey
ALTER TABLE `bookentryticket` DROP FOREIGN KEY `BookEntryTicket_bookId_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_accountId_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `sale` DROP FOREIGN KEY `Sale_accountId_fkey`;

-- DropForeignKey
ALTER TABLE `sale` DROP FOREIGN KEY `Sale_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `saledetail` DROP FOREIGN KEY `SaleDetail_bookId_fkey`;

-- DropForeignKey
ALTER TABLE `saledetail` DROP FOREIGN KEY `SaleDetail_saleId_fkey`;

-- DropTable
DROP TABLE `account`;

-- DropTable
DROP TABLE `author`;

-- DropTable
DROP TABLE `book`;

-- DropTable
DROP TABLE `bookentryticket`;

-- DropTable
DROP TABLE `category`;

-- DropTable
DROP TABLE `config`;

-- DropTable
DROP TABLE `customer`;

-- DropTable
DROP TABLE `payment`;

-- DropTable
DROP TABLE `sale`;

-- DropTable
DROP TABLE `saledetail`;

-- CreateTable
CREATE TABLE `TAIKHOAN` (
    `MaTK` INTEGER NOT NULL AUTO_INCREMENT,
    `TenDangNhap` VARCHAR(255) NOT NULL,
    `MatKhau` VARCHAR(255) NOT NULL,
    `MaNhom` INTEGER NOT NULL,

    UNIQUE INDEX `TAIKHOAN_TenDangNhap_key`(`TenDangNhap`),
    PRIMARY KEY (`MaTK`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NHOMNGUOIDUNG` (
    `MaNhom` INTEGER NOT NULL AUTO_INCREMENT,
    `TenNhom` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `NHOMNGUOIDUNG_TenNhom_key`(`TenNhom`),
    PRIMARY KEY (`MaNhom`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CHUCNANG` (
    `MaChucNang` INTEGER NOT NULL AUTO_INCREMENT,
    `TenChucNang` VARCHAR(255) NOT NULL,
    `TenManHinhDuocLoad` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`MaChucNang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PHANQUYEN` (
    `MaNhom` INTEGER NOT NULL,
    `MaChucNang` INTEGER NOT NULL,

    PRIMARY KEY (`MaNhom`, `MaChucNang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `THAMCHIEU` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `SoLuongNhapToiThieu` INTEGER NOT NULL,
    `SoLuongTonToiThieu` INTEGER NOT NULL,
    `TonKhoToiThieuSauBan` INTEGER NOT NULL,
    `TyLeDonGia` DECIMAL(65, 30) NOT NULL,
    `CongNoToiDa` INTEGER NOT NULL,
    `SuDungQuyDinh` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TACGIA` (
    `MaTG` INTEGER NOT NULL AUTO_INCREMENT,
    `TenTG` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`MaTG`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CT_TACGIA` (
    `MaTG` INTEGER NOT NULL,
    `MaDauSach` INTEGER NOT NULL,

    PRIMARY KEY (`MaTG`, `MaDauSach`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DAUSACH` (
    `MaDauSach` INTEGER NOT NULL AUTO_INCREMENT,
    `TenDauSach` VARCHAR(255) NOT NULL,
    `MaTL` INTEGER NOT NULL,

    PRIMARY KEY (`MaDauSach`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `THELOAI` (
    `MaTL` INTEGER NOT NULL AUTO_INCREMENT,
    `TenTL` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`MaTL`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SACH` (
    `MaSach` INTEGER NOT NULL AUTO_INCREMENT,
    `NhaXuatBan` VARCHAR(255) NOT NULL,
    `NamXuatBan` VARCHAR(255) NOT NULL,
    `DonGiaBan` DECIMAL(65, 30) NOT NULL,
    `SoLuongTon` INTEGER NOT NULL,
    `MaDauSach` INTEGER NOT NULL,

    PRIMARY KEY (`MaSach`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BAOCAOTON` (
    `MaSach` INTEGER NOT NULL,
    `Thang` INTEGER NOT NULL,
    `Nam` INTEGER NOT NULL,
    `TonDau` DECIMAL(65, 30) NOT NULL,
    `PhatSinh` DECIMAL(65, 30) NOT NULL,
    `TonCuoi` DECIMAL(65, 30) NOT NULL,

    UNIQUE INDEX `BAOCAOTON_MaSach_Thang_Nam_key`(`MaSach`, `Thang`, `Nam`),
    PRIMARY KEY (`MaSach`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PHIEUNHAPSACH` (
    `MaPhieuNhapSach` INTEGER NOT NULL AUTO_INCREMENT,
    `NgayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `TongTien` DECIMAL(65, 30) NOT NULL,
    `MaTK` INTEGER NOT NULL,

    PRIMARY KEY (`MaPhieuNhapSach`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CT_PHIEUNHAPSACH` (
    `SoLuong` INTEGER NOT NULL,
    `DonGia` DECIMAL(65, 30) NOT NULL,
    `ThanhTien` DECIMAL(65, 30) NOT NULL,
    `MaPhieuNhapSach` INTEGER NOT NULL,
    `MaSach` INTEGER NOT NULL,

    PRIMARY KEY (`MaPhieuNhapSach`, `MaSach`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KHACHHANG` (
    `MaKH` INTEGER NOT NULL AUTO_INCREMENT,
    `HoTen` VARCHAR(255) NOT NULL,
    `DiaChi` VARCHAR(255) NOT NULL,
    `SoDienThoai` VARCHAR(255) NOT NULL,
    `Email` VARCHAR(255) NOT NULL,
    `TienNo` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`MaKH`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HOADONBANSACH` (
    `MaHD` INTEGER NOT NULL AUTO_INCREMENT,
    `TongTien` DECIMAL(65, 30) NOT NULL,
    `NgayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `MaKH` INTEGER NOT NULL,
    `MaTK` INTEGER NOT NULL,

    PRIMARY KEY (`MaHD`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CT_HOADON` (
    `MaHD` INTEGER NOT NULL,
    `MaSach` INTEGER NOT NULL,
    `SoLuong` INTEGER NOT NULL,
    `DonGia` DECIMAL(65, 30) NOT NULL,
    `ThanhThien` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`MaHD`, `MaSach`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PHIEUTHUTIEN` (
    `MaPhieuThuTien` INTEGER NOT NULL AUTO_INCREMENT,
    `SoTien` DECIMAL(65, 30) NOT NULL,
    `NgayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `MaKH` INTEGER NOT NULL,
    `MaTK` INTEGER NOT NULL,

    PRIMARY KEY (`MaPhieuThuTien`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BAOCAOCONGNO` (
    `MaKH` INTEGER NOT NULL,
    `Thang` INTEGER NOT NULL,
    `Nam` INTEGER NOT NULL,
    `TonDau` DECIMAL(65, 30) NOT NULL,
    `PhatSinh` DECIMAL(65, 30) NOT NULL,
    `TonCuoi` DECIMAL(65, 30) NOT NULL,

    UNIQUE INDEX `BAOCAOCONGNO_MaKH_Thang_Nam_key`(`MaKH`, `Thang`, `Nam`),
    PRIMARY KEY (`MaKH`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TAIKHOAN` ADD CONSTRAINT `TAIKHOAN_MaNhom_fkey` FOREIGN KEY (`MaNhom`) REFERENCES `NHOMNGUOIDUNG`(`MaNhom`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PHANQUYEN` ADD CONSTRAINT `PHANQUYEN_MaNhom_fkey` FOREIGN KEY (`MaNhom`) REFERENCES `NHOMNGUOIDUNG`(`MaNhom`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PHANQUYEN` ADD CONSTRAINT `PHANQUYEN_MaChucNang_fkey` FOREIGN KEY (`MaChucNang`) REFERENCES `CHUCNANG`(`MaChucNang`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CT_TACGIA` ADD CONSTRAINT `CT_TACGIA_MaTG_fkey` FOREIGN KEY (`MaTG`) REFERENCES `TACGIA`(`MaTG`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CT_TACGIA` ADD CONSTRAINT `CT_TACGIA_MaDauSach_fkey` FOREIGN KEY (`MaDauSach`) REFERENCES `DAUSACH`(`MaDauSach`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DAUSACH` ADD CONSTRAINT `DAUSACH_MaTL_fkey` FOREIGN KEY (`MaTL`) REFERENCES `THELOAI`(`MaTL`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SACH` ADD CONSTRAINT `SACH_MaDauSach_fkey` FOREIGN KEY (`MaDauSach`) REFERENCES `DAUSACH`(`MaDauSach`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BAOCAOTON` ADD CONSTRAINT `BAOCAOTON_MaSach_fkey` FOREIGN KEY (`MaSach`) REFERENCES `SACH`(`MaSach`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PHIEUNHAPSACH` ADD CONSTRAINT `PHIEUNHAPSACH_MaTK_fkey` FOREIGN KEY (`MaTK`) REFERENCES `TAIKHOAN`(`MaTK`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CT_PHIEUNHAPSACH` ADD CONSTRAINT `CT_PHIEUNHAPSACH_MaPhieuNhapSach_fkey` FOREIGN KEY (`MaPhieuNhapSach`) REFERENCES `PHIEUNHAPSACH`(`MaPhieuNhapSach`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CT_PHIEUNHAPSACH` ADD CONSTRAINT `CT_PHIEUNHAPSACH_MaSach_fkey` FOREIGN KEY (`MaSach`) REFERENCES `SACH`(`MaSach`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HOADONBANSACH` ADD CONSTRAINT `HOADONBANSACH_MaKH_fkey` FOREIGN KEY (`MaKH`) REFERENCES `KHACHHANG`(`MaKH`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HOADONBANSACH` ADD CONSTRAINT `HOADONBANSACH_MaTK_fkey` FOREIGN KEY (`MaTK`) REFERENCES `TAIKHOAN`(`MaTK`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CT_HOADON` ADD CONSTRAINT `CT_HOADON_MaHD_fkey` FOREIGN KEY (`MaHD`) REFERENCES `HOADONBANSACH`(`MaHD`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CT_HOADON` ADD CONSTRAINT `CT_HOADON_MaSach_fkey` FOREIGN KEY (`MaSach`) REFERENCES `SACH`(`MaSach`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PHIEUTHUTIEN` ADD CONSTRAINT `PHIEUTHUTIEN_MaKH_fkey` FOREIGN KEY (`MaKH`) REFERENCES `KHACHHANG`(`MaKH`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PHIEUTHUTIEN` ADD CONSTRAINT `PHIEUTHUTIEN_MaTK_fkey` FOREIGN KEY (`MaTK`) REFERENCES `TAIKHOAN`(`MaTK`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BAOCAOCONGNO` ADD CONSTRAINT `BAOCAOCONGNO_MaKH_fkey` FOREIGN KEY (`MaKH`) REFERENCES `KHACHHANG`(`MaKH`) ON DELETE RESTRICT ON UPDATE CASCADE;
