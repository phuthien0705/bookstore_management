import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const bookEntryDetailRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        MaSach: z.number().int(),
        SoLuong: z.number(),
        MaPhieuNhapSach: z.number().int(),
        DonGia: z.number(),
        ThanhTien: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.cT_PHIEUNHAPSACH.create({
        data: { ...input },
      });
    }),
  get: protectedProcedure
    .input(
      z.object({
        MaPhieuNhapSach: z.number().int(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.cT_PHIEUNHAPSACH.findMany({
        include: {
          Sach: {
            include: {
              DauSach: true,
            },
          },
        },
        where: {
          MaPhieuNhapSach: input.MaPhieuNhapSach,
        },
      });
    }),
});
