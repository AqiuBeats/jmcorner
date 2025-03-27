import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { EXP_TIME } from '@/utils/constants';
import { decodeAESData } from '@/utils/aesUtils';

const adapter = PrismaAdapter(prisma);

const expTime = EXP_TIME;
// const tokenExpTime = EXP_TIME;

declare module 'next-auth' {
  interface Session {
    user: {
      id: string; // 添加 id 属性
      token: string; //添加 token 属性
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
    };
  }
}

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
        console.log('credentials', credentials);
        if (!credentials?.phone || !credentials?.password) {
          throw new Error('Invalid credentials');
        }
        const user = await prisma.user.findUnique({
          where: { phone: credentials.phone },
        });
        if (!user) {
          throw new Error('用户不存在');
        }
        try {
          const decode_pwd = decodeAESData(credentials.password);
          if (!user || !(await bcrypt.compare(decode_pwd, user.password))) {
            throw new Error('密码错误');
          }
        } catch (error) {
          console.log('解密失败', error);
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
    // signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // 添加用户 ID 到 JWT
        // token.name = user.name;
        // 自定义 JWT 生成
        if (!process.env.JWT_SECRET) {
          throw new Error('JWT_SECRET is not defined');
        }
        // const jwt_token = jwt.sign(
        //   { userId: user.id },
        //   process.env.JWT_SECRET,
        //   {
        //     expiresIn: tokenExpTime,
        //   },
        // );
        // token.jwt = jwt_token;
      }
      return token;
      // return { ...token, ...user };
    },
    async session({ session, token }) {
      if (typeof token.id === 'string') {
        session.user.id = token.id;
      }
      if (typeof token.jwt === 'string') {
        session.user.token = token.jwt;
      }
      session.user.name = token.name;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // 加密密钥
};

export default NextAuth(authOptions);
