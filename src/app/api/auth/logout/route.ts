import { AuthService } from '@/helpers';
import { apiHandler, setJson } from '@/helpers/api';

/**
 * 登出接口
 */
const logout = apiHandler(
  async () => {
    const response = setJson({
      data: null,
      message: '登出成功',
      status: 200,
    });
    // 调用 AuthService 的登出方法
    AuthService.clearAuthCookie(response); // 清除cookie
    return response;
  },
  {
    methods: ['POST'], //此"POST"用于早期验证,统一错误处理：如果方法不匹配会自动返回 405 Method Not Allowed 错误。
    authRequired: true, // 需要验证
  },
);

export const POST = logout;
export const dynamic = 'force-dynamic'; // 动态路由
