/* eslint-disable @typescript-eslint/no-unsafe-return */
import { type GetServerSidePropsContext } from "next";
import { getServerSession, type NextAuthOptions, type User } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { type NHOMNGUOIDUNG, type TAIKHOAN } from "@prisma/client";
import { prisma } from "./db";
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface User extends TAIKHOAN {
    MaTK: number;
    TenDangNhap: string;
    MatKhau: string;
    NhomNguoiDung: NHOMNGUOIDUNG;
  }
  interface AdapterUser {
    MaTK: number;
    TenDangNhap: string;
    MatKhau: string;
    NhomNguoiDung: NHOMNGUOIDUNG;
  }
  interface Session {
    user: User;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 3000,
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        TenDangNhap: { label: "TenDangNhap", type: "text" },
        MatKhau: { label: "MatKhau", type: "text" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const user = await prisma.tAIKHOAN.findUnique({
          where: { TenDangNhap: credentials?.TenDangNhap },
          include: {
            NhomNguoiDung: true,
          },
        });
        if (!user || user.MatKhau !== credentials?.MatKhau) {
          throw new Error("No user found with this username and password");
        }
        return user as unknown as User;
      },
    }),
  ],
  secret: "secret",
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/require-await
    jwt: async ({ token, user }) => {
      user && (token.user = user);
      return token;
    },
    //whatever value we return here will be the value of the next-auth session
    // eslint-disable-next-line @typescript-eslint/require-await
    session: async ({ session, token, user }) => {
      const sessonData: any = {
        ...session,
        user: { ...session.user, ...user, ...token.user! }, // combine the session and db user
      };
      return sessonData;
    },
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
