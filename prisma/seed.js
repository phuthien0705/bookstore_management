import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  await prisma.thamchieu.create({
    data: {
      SoLuongNhapToiThieu: 150, //Số lượng nhập ít nhất là 150
      SoLuongTonToiThieu: 300, //Chỉ nhập các sách có lượng tồn ít hơn 300.
      TonKhoToiThieuSauBan: 20, //đầu sách có lượng tồn sau khi bán ít nhất là 20
      CongNoToiDa: 1000000, //Chỉ bán cho các khách hàng nợ không quá 1.000.000đ
      SuDungQuyDinh: false,
    },
  });
  await prisma.taikhoan.create({
    data: {
      TenDangNhap: "admin",
      MatKhau: "123456",
      MaNhom: "2",
    },
    data: {
      TenDangNhap: "staff",
      MatKhau: "123456",
      MaNhom: "1",
    },
  });
}

seed()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
