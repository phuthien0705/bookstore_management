import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const bookEntryTicketRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        NgayTao: z.string(),
        TongTien: z.number(),
        MaTK: z.number().int(),
        DanhSachSach: z.array(
          z.object({
            NhaXuatBan: z.string(),
            NamXuatBan: z.string(),
            DonGiaBan: z.number(),
            SoLuongTon: z.number(),
            MaDauSach: z.number(),
            MaSach: z.number().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const PhieuNhapSach = await ctx.prisma.pHIEUNHAPSACH.create({
        data: {
          NgayTao: input.NgayTao,
          TongTien: input.TongTien,
          MaTK: input.MaTK,
        },
      });

      const res = await ctx.prisma.sACH.createMany({
        data: input.DanhSachSach.filter((item) => !item.MaSach),
      });

      await Promise.all(
        input.DanhSachSach.filter((item) => item.MaSach).map(
          ({ MaSach, SoLuongTon, ...item }) => {
            return ctx.prisma.sACH.update({
              data: { ...item, SoLuongTon: { increment: SoLuongTon } },
              where: {
                MaSach: MaSach,
              },
            });
          }
        )
      );

      await Promise.all(
        input.DanhSachSach.filter((item) => item.MaSach).map(
          ({ MaSach, ...i }) => {
            return ctx.prisma.cT_PHIEUNHAPSACH.create({
              data: {
                MaPhieuNhapSach: PhieuNhapSach.MaPhieuNhapSach,
                MaSach: MaSach as number,
                SoLuong: i.SoLuongTon,
                DonGia: i.DonGiaBan,
                ThanhTien: i.SoLuongTon * (i.DonGiaBan as unknown as number),
              },
            });
          }
        )
      );

      const count = res.count;

      const DanhSachSach = await ctx.prisma.sACH.findMany({
        orderBy: {
          MaSach: "desc",
        },
        take: count,
      });

      return ctx.prisma.cT_PHIEUNHAPSACH.createMany({
        data: DanhSachSach.map((i) => {
          return {
            MaPhieuNhapSach: PhieuNhapSach.MaPhieuNhapSach,
            MaSach: i.MaSach,
            SoLuong: i.SoLuongTon,
            DonGia: i.DonGiaBan,
            ThanhTien: i.SoLuongTon * (i.DonGiaBan as unknown as number),
          };
        }),
      });
    }),
  getLast: protectedProcedure.input(z.object({})).query(async ({ ctx }) => {
    const lastBookEntryTicket = await ctx.prisma.pHIEUNHAPSACH.findFirst({
      orderBy: { MaPhieuNhapSach: "desc" },
    });

    return lastBookEntryTicket;
  }),
  getAll: protectedProcedure.input(z.object({})).query(({ ctx }) => {
    return ctx.prisma.pHIEUNHAPSACH.findMany({
      include: {
        TaiKhoan: true,
      },
    });
  }),
});
