import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const bookEntryTicketRouter = createTRPCRouter({
    create: protectedProcedure
    .input(
        z.object({
            NgayTao: z.string(),
            TongTien: z.number(),
            MaTK: z.number().int(),
        })
    )
    .mutation(({ input, ctx }) => {
            return ctx.prisma.pHIEUNHAPSACH.create({
            data: { ...input },
        });
    }),
})