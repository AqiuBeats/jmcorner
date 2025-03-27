/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import joi from 'joi';
import validateWithJoi from './validateWithJoi';
import { timeUTCToCN } from '@/utils/timeUtils';
import { AuthService } from '@/helpers';

type Handler = (req: NextRequest, params?: any) => Promise<any>;

interface ApiHandlerOptions {
  schema?: {
    body?: joi.Schema;
    query?: joi.Schema;
    params?: joi.Schema;
  };
  methods?: ('GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT')[];
  isPublic?: boolean; // 是否公开
  authRequired?: boolean; // 是否token认证
}

interface Query {
  [key: string]: string;
}

export function apiHandler(handler: Handler, options: ApiHandlerOptions = {}) {
  return async (req: NextRequest) => {
    try {
      // 设置默认值并验证配置
      const isPublic = options.isPublic ?? false; // 默认为非公开
      const authRequired = options.authRequired ?? true; // 默认为需要认证
      // 0. 认证检查（在方法验证之前）
      if (isPublic && options.authRequired === true) {
        //只有显示的设置authRequired为true时才需要认证
        console.warn('冗余配置：isPublic=true 时 authRequired 应设置为 false');
      }
      if (!isPublic && authRequired) {
        try {
          const userId = await AuthService.verifyRequest(req);
          // 将用户ID添加到请求头中供后续使用
          req.headers.set('x-user-id', userId || '');
        } catch (authError) {
          return NextResponse.json(
            {
              message: '未授权，请先登录.',
              error: (authError as Error).message,
            },
            { status: 401 },
          );
        }
      }
      // 1. 验证请求方法
      if (options.methods && !options.methods.includes(req.method as any)) {
        return NextResponse.json(
          { message: `Method ${req.method} not allowed` },
          { status: 405 },
        );
      }

      // 2. 准备请求数据
      let body = {};
      const query: Query = {};
      const url = new URL(req.url);

      url.searchParams.forEach((value, key) => {
        query[key] = value;
      });

      // 3. 解析请求体
      if (['POST', 'PATCH', 'PUT'].includes(req.method)) {
        try {
          body = await req.json();
        } catch (error) {
          console.error('Error parsing JSON body:', error);
          if (req.headers.get('content-type')?.includes('application/json')) {
            return NextResponse.json(
              { message: 'Invalid JSON body' },
              { status: 400 },
            );
          }
        }
      }

      // 4. 数据验证
      if (options.schema?.body) {
        const validation = validateWithJoi(options.schema.body, body, 'body');
        if (!validation.isValid) {
          return NextResponse.json(
            {
              message: validation.formattedMessage,
              errors: validation.errors,
            },
            { status: 400 },
          );
        }
        body = validation.value;
      }

      // 5. 执行处理器
      const result = await handler(req, {
        body,
        query,
      });

      // 6. 处理响应和设置cookie
      let response: NextResponse;

      if (result && result.headers && result.body) {
        response = result;
      } else if (result && result.data !== undefined) {
        response = NextResponse.json(result, { status: result.status || 200 });
      } else {
        response = NextResponse.json(
          {
            data: result,
            message: 'Success',
            timestamp: timeUTCToCN(new Date()),
          },
          { status: 200 },
        );
      }
      return response;
    } catch (error) {
      console.error('API Error:', error);

      let status = 500;
      let message = 'Internal server error';

      if (error instanceof Error) {
        if (error.message.includes('用户不存在')) {
          status = 404;
        } else if (
          error.message.includes('密码错误') ||
          error.message.includes('未授权')
        ) {
          status = 401;
        } else if (error.message.includes('验证失败')) {
          status = 400;
        }
        message = error.message;
      }

      return NextResponse.json(
        {
          message,
          error:
            process.env.NODE_ENV === 'development' && error instanceof Error
              ? error.stack
              : undefined,
        },
        { status },
      );
    }
  };
}
