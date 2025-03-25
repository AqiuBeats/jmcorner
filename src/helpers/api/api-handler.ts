import { NextResponse } from 'next/server';

 

import {
  errorHandler,
  jwtMiddleware,
  validateMiddleware,
  // identityMiddleware,
} from '.';

// 定义参数接口
interface ApiHandlerOptions {
  identity?: any; // 根据实际需求定义更具体的类型
  schema?: any; // 根据实际需求定义更具体的类型
  isJwt?: boolean;
}

export { apiHandler };

function isPublicPath(req: any) {
  // public routes that don't require authentication
  const publicPaths = [
    'POST:/api/auth/login',
    'POST:/api/auth/logout',
    'POST:/api/auth/register',
  ];
  return publicPaths.includes(`${req.method}:${req.nextUrl.pathname}`);
}

function apiHandler(
  handler: (req: any, ...args: any[]) => Promise<any>,
  options: ApiHandlerOptions = {},
) {
  return async (req: any, ...args: any[]) => {
    try {
      if (!isPublicPath(req)) {
        // global middleware
        await jwtMiddleware(req, options.isJwt ?? false); // 使用 nullish coalescing 提供默认值
        // await identityMiddleware(req, options.identity, options.isJwt ?? false);
        await validateMiddleware(req, options.schema);
      }
      // route handler
      const responseBody = await handler(req, ...args);
      return NextResponse.json(responseBody || {});
    } catch (err) {
      console.log('global error handler', err);
      // global error handler
      return errorHandler(err);
    }
  };
}
