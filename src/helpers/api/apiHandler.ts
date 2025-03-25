import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import joi from 'joi';
import validateWithJoi from './validateWithJoi';
import { timeUTCToCN } from '@/utils/timeUtils';

type Handler = (req: NextRequest, params?: any) => Promise<any>;

interface ApiHandlerOptions {
  schema?: {
    body?: joi.Schema; // 请求体验证
    query?: joi.Schema; // 查询参数验证
    params?: joi.Schema; // 路由参数验证
  };
  methods?: ('GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT')[]; // 允许的HTTP方法
  isPublic?: boolean;
}

interface Query {
  [key: string]: string;
}

export function apiHandler(handler: Handler, options: ApiHandlerOptions = {}) {
  return async (req: NextRequest) => {
    try {
      // 1. 验证请求方法
      if (options.methods && !options.methods.includes(req.method as any)) {
        return NextResponse.json(
          { message: `Method ${req.method} not allowed` },
          { status: 405 },
        );
      }

      // 2. 准备请求数据
      let body = {};
      // 解析查询参数
      let query: Query = {};
      const url = new URL(req.url);

      url.searchParams.forEach((value, key) => {
        query[key] = value;
      });

      // 3. 解析请求体（如果是POST/PATCH/PUT）
      if (['POST', 'PATCH', 'PUT'].includes(req.method)) {
        try {
          body = await req.json();
        } catch (error) {
          // 非JSON请求体处理
          if (req.headers.get('content-type')?.includes('application/json')) {
            return NextResponse.json(
              { message: 'Invalid JSON body' },
              { status: 400 },
            );
          }
          // 其他类型的请求体可以在这里处理
        }
      }

      // 4. 数据验证
      if (options.schema?.body) {
        const validation = validateWithJoi(options.schema.body, body, 'body');
        if (!validation.isValid) {
          return NextResponse.json(
            {
              message: validation.formattedMessage,
              errors: validation.errors, // 返回所有验证错误详情
            },
            { status: 400 },
          );
        }
        // 使用经过验证和转换的值
        body = validation.value;
      }

      // 5. 执行处理器
      const result = await handler(req, {
        body,
        query,
        // 可以添加更多上下文信息
      });

      // 6. 格式化响应
      if (result && result.headers && result.body) {
        // 如果处理器返回了完整的响应对象
        return result;
      } else if (result && result.data !== undefined) {
        // 如果处理器返回了数据对象
        return NextResponse.json(result, { status: result.status || 200 });
      } else {
        // 默认响应格式
        return NextResponse.json(
          {
            data: result,
            message: 'Success',
            timestamp: timeUTCToCN(new Date()),
          },
          { status: 200 },
        );
      }
    } catch (error) {
      // 7. 错误处理
      console.error('API Error:', error);

      let status = 500;
      let message = 'Internal server error';

      if (error instanceof Error) {
        // 根据错误类型设置状态码
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

// 辅助函数
export function setJson(data: {
  data?: any;
  message?: string;
  status?: number;
  [key: string]: any;
}) {
  return NextResponse.json(
    {
      data: data.data,
      message: data.message || 'Success',
      ...(data.metadata ? { metadata: data.metadata } : {}),
      timestamp: timeUTCToCN(new Date()),
    },
    { status: data.status || 200 },
  );
}
