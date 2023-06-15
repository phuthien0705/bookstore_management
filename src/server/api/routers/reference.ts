import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const referenceRouter = createTRPCRouter({
    get: protectedProcedure
    .input(z.object({}))
    .query(({ ctx }) => {
        return ctx.prisma.tHAMCHIEU.findFirst({});
    }),
})