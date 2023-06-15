import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

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
            ThanhThien: z.number(),
          })
        ),
      })
    )
    .output(z.object({}))
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
          ThanhThien: i.ThanhThien,
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
});
