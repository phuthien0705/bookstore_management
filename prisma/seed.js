import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  await prisma.config.create({
    data: {
      minEntry: 150, //Số lượng nhập ít nhất là 150
      minStockAfterEntry: 300, //Chỉ nhập các sách có lượng tồn ít hơn 300.
      minStockAfterSale: 20, //đầu sách có lượng tồn sau khi bán ít nhất là 20
      maxDebt: 1000000, //Chỉ bán cho các khách hàng nợ không quá 1.000.000đ
      disableAllRule: false,
    },
  });
  await prisma.account.create({
    data: {
      username: "admin",
      password: "password",
      role: "admin",
    },
  });
}

seed()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
