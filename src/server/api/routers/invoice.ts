import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const invoiceRouter = createTRPCRouter({
  createHD: protectedProcedure
    .input(
      z.object({
        TongTien: z.number(),
        MaKH: z.number().int(),
        CT_HOADON: z.array(
          z.object({
            MaSach: z.number().int(),
            SoLuong: z.number().int(),
            DonGia: z.number(),
            ThanhTien: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const invoice = await ctx.prisma.hOADONBANSACH.create({
        data: { TongTien: input.TongTien, MaKH: input.MaKH, MaTK: 1 },
      });
      return ctx.prisma.cT_HOADON.createMany({
        data: input.CT_HOADON.map((i) => ({
          MaHD: invoice.MaHD,
          MaSach: i.MaSach,
          SoLuong: i.SoLuong,
          DonGia: i.DonGia,
          ThanhTien: i.ThanhTien,
        })),
      });
    }),

  getKhachHang: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.kHACHHANG.findMany();
  }),

  getKhachHangById: protectedProcedure
    .input(z.object({ MaKH: z.number() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.prisma.kHACHHANG.findUnique({
        where: {
          MaKH: input.MaKH,
        },
      });

      return {
        result,
      };
    }),

  getSachById: protectedProcedure
    .input(z.object({ MaSach: z.number() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.prisma.sACH.findMany({
        where: {
          MaSach: input.MaSach,
        },
        include: {
          DauSach: {
            select: {
              TenDauSach: true,
            },
          },
        },
      });

      return {
        result,
      };
    }),
  getAllBookWithTitle: protectedProcedure.query(async ({ ctx }) => {
    const books = await ctx.prisma.sACH.findMany({
      include: {
        DauSach: {
          select: {
            TenDauSach: true,
          },
        },
      },
    });

    return books;
  }),
  getThamChieu: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.tHAMCHIEU.findFirst({
      where: {
        SuDungQuyDinh: true,
      },
      select: {
        TonKhoToiThieuSauBan: true,
        CongNoToiDa: true,
      },
    });
  }),
  updateDebitOnNewInvoice: protectedProcedure
    .input(
      z.object({
        MaKH: z.number().int(),
        NoHienTai: z.number(),
        ConLai: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.kHACHHANG.update({
        data: { TienNo: input.NoHienTai + input.ConLai },
        where: { MaKH: input.MaKH },
      });
    }),
  updateBookQuantity: protectedProcedure
    .input(
      z.object({
        MaSach: z.number().int(),
        Current: z.number(),
        Quantity: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.sACH.update({
        data: { SoLuongTon: input.Current - input.Quantity },
        where: { MaSach: input.MaSach },
      });
    }),
  updateDebit: protectedProcedure
    .input(
      z.object({
        MaKH: z.number().int(),
        NewDebit: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.kHACHHANG.update({
        data: { TienNo: input.NewDebit },
        where: { MaKH: input.MaKH },
      });
    }),
  createPhieuThuTien: protectedProcedure
    .input(
      z.object({
        SoTien: z.number(),
        MaKH: z.number().int(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.pHIEUTHUTIEN.create({
        data: {
          SoTien: input.SoTien,
          MaKH: input.MaKH,
          MaTK: 1,
        },
      });
    }),
});
