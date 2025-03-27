/* eslint-disable @typescript-eslint/no-explicit-any */

import { EXP_TIME } from '@/utils/constants';
import { timeUTCToCN } from '@/utils/timeUtils';
import { NextResponse } from 'next/server';

// 增强后的 setJson 函数
export function setJson(data: {
  data?: any;
  message?: string;
  status?: number;
  authToken?: string; // 新增 authToken 参数
  [key: string]: any;
}) {
  // 创建基础响应
  const response = NextResponse.json(
    {
      data: data.data,
      message: data.message || 'Success',
      ...(data.metadata ? { metadata: data.metadata } : {}),
      timestamp: timeUTCToCN(new Date()),
    },
    { status: data.status || 200 },
  );

  // 如果提供了 authToken，则设置 HTTP-only cookie
  if (data.authToken) {
    response.cookies.set('authToken', data.authToken, {
      path: '/', //这个属性表示cookie可以在整个网站中访问。
      httpOnly: true, //这个属性表示cookie只能通过Http请求访问，不能通过JavaScript访问，这样可以防止XSS攻击。
      sameSite: 'lax', //这个属性表示cookie只能在同源请求中发送，这样可以防止CSRF攻击。
      maxAge: EXP_TIME,
      // domain: '.yourDomain.com', // 如果需要跨子域可以取消注释
    });
  }
  console.log('登录成功之后', response);
  return response;
}
