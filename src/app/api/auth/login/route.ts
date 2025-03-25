import { usersRepo } from '@/helpers';
import { apiHandler, setJson } from '@/helpers/api';
import joi from 'joi';

const login = apiHandler(
  async (_req, { body }) => {
    const newUser = await usersRepo.authenticate(body);
    return setJson({
      data: newUser,
      message: '登录成功',
      status: 201, // 创建资源返回201
    });
  },
  {
    methods: ['POST'],
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

// 导出一个异步函数，用于处理 POST 请求，并返回一个包含用户信息的 JSON 响应。
export const POST = login;
//这行代码用于配置 Next.js 的动态渲染行为。表示强制将此路由标记为动态路由，即使它可能包含一些静态内容。
//这种设置通常用于需要在服务器端动态生成内容的场景，确保每次请求都由服务器处理，而不是提前静态生成。
export const dynamic = 'force-dynamic';
