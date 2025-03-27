/* eslint-disable @typescript-eslint/no-explicit-any */

// src/utils/auth.ts
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export async function verifyClientToken(): Promise<{
  isValid: boolean;
  isExpired: boolean;
  userId?: string;
  expTime?: string;
}> {
  try {
    const token = (await cookies()).get('authToken')?.value;
    if (!token) return { isValid: false, isExpired: false };

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    return {
      isValid: true, //是否有效
      isExpired: false, //是否过期
      userId: payload.id as string, //用户id
      expTime: getTokenExpiration(token), //过期时间
    };
  } catch (error: any) {
    return {
      isValid: false,
      isExpired: error.name === 'JWTExpired',
    };
  }
}

function getTokenExpiration(token: string): string | undefined {
  if (!token) return undefined;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    return new Date(exp * 1000).toLocaleString(); // 转换为本地时间字符串
  } catch (error) {
    console.error('Failed to parse token:', error);
    return undefined;
  }
}
