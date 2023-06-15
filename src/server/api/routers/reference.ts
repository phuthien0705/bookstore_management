import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const referenceRouter = createTRPCRouter({
    get: protectedProcedure
    .input(z.object({}))
    .query(({ ctx }) => {
        return ctx.prisma.tHAMCHIEU.findFirst({});
    }),
    update: protectedProcedure
    .input(
      z.object({
        id: z.number().int(),
        SoLuongNhapToiThieu: z.number(),
        SoLuongTonToiThieu: z.number(),
        TonKhoToiThieuSauBan: z.number(),
        TyLeDonGia: z.number(),
        CongNoToiDa: z.number(),
        SuDungQuyDinh: z.boolean()
      })
    )
    .mutation(({ input, ctx }) => {
      const { id, ...req } = input;
      return ctx.prisma.tHAMCHIEU.update({
        data: { ...req },
        where: { id },
      });
    }),
})