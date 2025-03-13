import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';

const adapter = PrismaAdapter(prisma);
const secretKey = process.env.AES_SECRET_KEY || '';
const expTime = 7 * 24 * 60 * 60; // 7天 过期时间

export const authOptions: NextAuthOptions = {
  // debug: true, // 启用调试模式
  adapter,
  session: {
    strategy: 'jwt',
    maxAge: expTime,
  },
  jwt: {
    maxAge: expTime,
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) {
          throw new Error('Invalid credentials');
        }
        const user = await prisma.user.findUnique({
          where: { phone: credentials.phone },
        });
        try {
          const bytes = CryptoJS.AES.decrypt(credentials.password, secretKey);
          const decode_pwd = bytes.toString(CryptoJS.enc.Utf8);
          if (!user || !(await bcrypt.compare(decode_pwd, user.password))) {
            throw new Error('Invalid credentials');
          }
        } catch (error) {
          throw new Error('解密失败');
        }
        if (user) {
          user.password = '';
        }
        return user;
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // 添加用户 ID 到 JWT
      }
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
};

export default NextAuth(authOptions);
