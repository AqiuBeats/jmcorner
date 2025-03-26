import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AuthService } from '@/helpers';
import jwt from 'jsonwebtoken';
import {
  REDIRECT_PATH,
  PUBLIC_PATHS,
  PROTECTED_API_PREFIXES,
  PROTECTED_PAGE_PATHS,
} from '@/config/auth-paths'; // 建议的路径配置文件

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. 检查是否为公开路径（精确匹配或前缀匹配）
  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + '/'),
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  // 2. 检查是否为需要认证的API路径
  const isProtectedApi = PROTECTED_API_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  // 3. 检查是否为需要认证的页面路径（支持动态路由）
  const isProtectedPage = PROTECTED_PAGE_PATHS.some((path) => {
    // 基础路径完全匹配（如/square）
    if (pathname === path) return true;

    // 处理动态路由（如/square/[id]）
    const basePath = path.split('[')[0]; // 提取动态路由前的基础路径
    return pathname.startsWith(basePath);
  });

  // 如果不是需要认证的API或页面，则放行
  if (!isProtectedApi && !isProtectedPage) {
    return NextResponse.next();
  }

  try {
    // 4. 统一使用AuthService验证
    const userId = await AuthService.verifyRequest(request);

    // 5. 将用户ID注入请求头（供API路由使用）
    const headers = new Headers(request.headers);
    headers.set('x-user-id', userId || '');

    // 6. 继续请求
    return NextResponse.next({
      request: { headers },
    });
  } catch (error) {
    console.error('认证失败:', error);

    // 7. 处理认证失败
    if (isProtectedApi) {
      // API返回401 JSON响应
      return NextResponse.json(
        { message: '未授权', error: (error as Error).message },
        { status: 401 },
      );
    } else {
      // 页面路由重定向到登录页
      const loginUrl = new URL(REDIRECT_PATH, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      if (error instanceof jwt.TokenExpiredError) {
        loginUrl.searchParams.set('expired', 'true');
      }

      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('authToken');
      return response;
    }
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
