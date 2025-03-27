import { EXP_TIME } from '@/utils/constants';
import { JWTPayload, SignJWT, jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

interface AuthPayload extends JWTPayload {
  id: string;
  role?: string;
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET environment variable');
}

const secretKey = new TextEncoder().encode(JWT_SECRET);

export class AuthService {
  static async verifyRequest(
    req: NextRequest,
    throwOnError = true,
  ): Promise<string | null> {
    try {
      const token =
        req.cookies.get('authToken')?.value ||
        req.headers.get('authorization')?.split(' ')[1];

      if (!token) {
        if (throwOnError) throw new Error('未授权，请先登录');
        return null;
      }
      const { payload } = await jwtVerify<AuthPayload>(token, secretKey);

      if (!payload.id) {
        throw new Error('无效的Token结构');
      }

      return payload.id;
    } catch (error) {
      if (throwOnError) {
        const message =
          error instanceof Error
            ? error.name === 'JWTExpired'
              ? 'Token已过期'
              : error.name === 'JWSInvalid'
                ? '无效Token'
                : error.message
            : '认证失败';
        throw new Error(message);
      }
      return null;
    }
  }

  static async createAccessToken(payload: AuthPayload): Promise<string> {
    // 精确控制：使用数字（Unix时间戳）,这个时间不一样,需要在当前时间进行一个偏移
    const EXP_TIME_IOS = Math.floor(Date.now() / 1000) + EXP_TIME;
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(EXP_TIME_IOS)
      .sign(secretKey);
  }

  static async refreshToken(oldToken: string): Promise<string | null> {
    try {
      const { payload } = await jwtVerify<AuthPayload>(oldToken, secretKey, {
        clockTolerance: 30,
      });
      return this.createAccessToken({ id: payload.id });
    } catch {
      return null;
    }
  }

  static clearAuthCookie(response: NextResponse): NextResponse {
    response.cookies.set({
      name: 'authToken',
      value: '',
      path: '/',
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return response;
  }
}
