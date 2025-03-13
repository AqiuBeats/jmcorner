import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';

const secretKey = process.env.AES_SECRET_KEY || '';

export async function POST(req: Request) {
  try {
    const { phone, password } = await req.json();
    if (!phone || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const existingUser = await prisma.user.findUnique({ where: { phone } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 },
      );
    }
    try {
      const bytes = CryptoJS.AES.decrypt(password, secretKey);
      const decode_pwd = bytes.toString(CryptoJS.enc.Utf8);
      const hashedPassword = await bcrypt.hash(decode_pwd, 10);
      await prisma.user.create({
        data: { phone, password: hashedPassword },
      });
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('解密失败：', error);
      return NextResponse.json({ error: '解密失败' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
