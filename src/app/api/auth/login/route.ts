import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signIn } from 'next-auth/react';

export async function POST(req: Request) {
  try {
    const { phone, password } = await req.json();
    console.log('phone', phone, password);
    if (!phone || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const result = await signIn('credentials', {
      redirect: false,
      phone,
      password,
    });

    if (result?.error) {
      // res.status(401).json({ message: result.error });
      return NextResponse.json({ error: result.error }, { status: 401 });
    } else {
      // res.status(200).json({ message: 'Login successful' });
      return NextResponse.json({ error: 'successful' }, { status: 200 });
    }

    // const existingUser = await prisma.user.findUnique({ where: { phone } });
    // if (existingUser) {
    //   return NextResponse.json(
    //     { error: 'User already exists' },
    //     { status: 400 },
    //   );
    // }
    // const hashedPassword = await bcrypt.hash(password, 10);
    // await prisma.user.create({
    //   data: { phone, password: hashedPassword },
    // });
    // return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
