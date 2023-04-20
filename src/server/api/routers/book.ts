import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const bookRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        price: z.number().int(),
        quantity: z.number().int(),
        authorId: z.number().int().nullable(),
        categoryId: z.number().int().nullable(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.book.create({
        data: { ...input },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.book.delete({
        where: { id: input.id },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.number().int(),
        title: z.string(),
        price: z.number().int(),
        quantity: z.number().int(),
        authorId: z.number().int().nullable(),
        categoryId: z.number().int().nullable(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { id, ...req } = input;
      return ctx.prisma.book.update({
        data: { ...req },
        where: { id },
      });
    }),

  getWithPagination: protectedProcedure
    .input(
      z.object({
        limit: z.number(),
        page: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { limit, page } = input;
      const [records, totalCount] = await Promise.all([
        ctx.prisma.book.findMany({
          skip: limit * (page - 1),
          take: limit,
        }),
        ctx.prisma.book.count(),
      ]);

      const totalPages = Math.ceil(totalCount / limit);
      const havePrevPage = page > 1;
      const haveNextPage = page < totalPages;

      return {
        datas: records,
        havePrevPage,
        haveNextPage,
        totalPages,
      };
    }),
});
