import { usersRepo } from '@/helpers';
import { apiHandler, setJson } from '@/helpers/api';
import joi from 'joi';

const login = apiHandler(
  async (_req, { body }) => {
    const { user, token } = await usersRepo.authenticate(body);
    return setJson({
      data: { user, token },
      message: '登录成功',
      status: 200, // 创建资源返回201
      authToken: token,
    });
  },
  {
    methods: ['POST'], //此"POST"用于早期验证,统一错误处理：如果方法不匹配会自动返回 405 Method Not Allowed 错误。
    isPublic: true, //公开路由
    schema: {
      body: joi.object({
        phone: joi
          .string()
          .pattern(/^1[3-9]\d{9}$/)
          .required(),
        password: joi.string().required(),
      }),
    },
  },
);

// 此"POST"告诉 Next.js 该文件（路由）需要响应 POST 请求。
export const POST = login;
//这行代码用于配置 Next.js 的动态渲染行为。表示强制将此路由标记为动态路由，即使它可能包含一些静态内容。
//这种设置通常用于需要在服务器端动态生成内容的场景，确保每次请求都由服务器处理，而不是提前静态生成。
export const dynamic = 'force-dynamic';
