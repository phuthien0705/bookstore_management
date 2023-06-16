import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const customerRouter = createTRPCRouter({
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

  getKhachHangByPhoneNumber: protectedProcedure
    .input(
      z.object({
        phoneNumber: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.kHACHHANG.findFirst({
        where: {
          SoDienThoai: input.phoneNumber,
        },
      });
    }),

  createKhachHang: protectedProcedure
    .input(
      z.object({
        HoTen: z.string(),
        DiaChi: z.string(),
        SoDienThoai: z.string(),
        Email: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.kHACHHANG.create({
        data: {
          ...input,
          TienNo: 0,
        },
      });
    }),

  updateInfoKhachHang: protectedProcedure
    .input(
      z.object({
        MaKH: z.number(),
        HoTen: z.string().optional(),
        DiaChi: z.string().optional(),
        SoDienThoai: z.string().optional(),
        Email: z.string().optional(),
        TienNo: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const khachHang = await ctx.prisma.kHACHHANG.findFirst({
        where: {
          MaKH: input.MaKH,
        },
      });

      await ctx.prisma.kHACHHANG.update({
        data: {
          HoTen: input.HoTen ? input.HoTen : khachHang?.HoTen,
          DiaChi: input.HoTen ? input.HoTen : khachHang?.DiaChi,
          SoDienThoai: input.HoTen ? input.HoTen : khachHang?.SoDienThoai,
          Email: input.HoTen ? input.HoTen : khachHang?.Email,
          TienNo: input.HoTen ? input.HoTen : khachHang?.TienNo,
        },
        where: {
          MaKH: input.MaKH,
        },
      });
    }),
});
