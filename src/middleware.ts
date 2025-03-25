// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// 可以配置需要验证的路径
const protectedPaths = ['/dashboard', '/profile', '/settings'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查当前路径是否需要验证
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (!isProtected) {
    return NextResponse.next();
  }

  // 从 cookie 或 header 获取 token
  const token =
    request.cookies.get('authToken')?.value ||
    request.headers.get('Authorization')?.replace('Bearer ', '');

  console.log('token', token);

  if (!token) {
    // 如果没有 token，重定向到登录页
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // 验证 token
    const decoded = jwt.verify(
      token,
      process.env.NEXT_PUBLIC_JWT_SECRET as string,
    );

    // 可以在这里添加额外的验证逻辑，比如检查用户角色等

    // 如果 token 有效，继续请求
    return NextResponse.next();
  } catch (err) {
    // token 无效或过期
    console.error('JWT verification failed:', err);

    // 重定向到登录页，并携带原始路径以便登录后跳转
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    loginUrl.searchParams.set('expired', 'true');

    // 清除无效的 token cookie
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('authToken');

    return response;
  }
}

// 配置 Middleware 匹配规则
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - 公开页面 (login, register, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|register).*)',
  ],
};
