import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const referenceRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.tHAMCHIEU.findFirst();
  }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.number().int(),
        SoLuongNhapToiThieu: z.number(),
        SoLuongTonToiDa: z.number(),
        TonKhoToiThieuSauBan: z.number(),
        TyLeDonGia: z.number(),
        CongNoToiDa: z.number(),
        SuDungQuyDinh: z.boolean(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { id, ...req } = input;
      return ctx.prisma.tHAMCHIEU.update({
        data: { ...req },
        where: { id },
      });
    }),
});
