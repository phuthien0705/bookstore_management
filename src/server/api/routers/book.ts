import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const bookRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.book.findMany();
  }),
});
