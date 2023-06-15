import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  await prisma.tHAMCHIEU.create({
    data: {
      SoLuongNhapToiThieu: 150, //Số lượng nhập ít nhất là 150
      SoLuongTonToiDa: 300, //Chỉ nhập các sách có lượng tồn ít hơn 300.
      TonKhoToiThieuSauBan: 20, //đầu sách có lượng tồn sau khi bán ít nhất là 20
      CongNoToiDa: 1000000, //Chỉ bán cho các khách hàng nợ không quá 1.000.000đ
      SuDungQuyDinh: false,
      TyLeDonGia: 1.05,
    },
  });
  await prisma.tAIKHOAN.createMany({
    data: [
      {
        TenDangNhap: "staff",
        MatKhau: "123456",
        MaNhom: 1,
      },
      {
        TenDangNhap: "admin",
        MatKhau: "123456",
        MaNhom: 2,
      },
    ],
  });
}

seed()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
