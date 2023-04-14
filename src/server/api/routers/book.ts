import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const bookRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        price: z.number(),
        quantity: z.number(),
        authors: z.number().array(),
        categorys: z.number().array(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { authors, categorys, title, price, quantity } = input;
      const authorArray = authors.map((i) => {
        return { authorId: i };
      });
      const categoryArray = categorys.map((i) => {
        return { categoryId: i };
      });
      return ctx.prisma.book.create({
        data: {
          title,
          price,
          quantity,
          BookAuthor: {
            createMany: {
              data: authorArray,
            },
          },
          BookCategory: {
            createMany: {
              data: categoryArray,
            },
          },
        },
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
        price: z.number(),
        quantity: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.book.update({
        data: {
          title: input.title,
          price: input.price,
          quantity: input.quantity,
        },
        where: { id: input.id },
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
