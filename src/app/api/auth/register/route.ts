import { usersRepo } from '@/helpers';
import { apiHandler, setJson } from '@/helpers/api';
import joi from 'joi';

const register = apiHandler(
  async (_req, { body }) => {
    const result = await usersRepo.create(body);
    return setJson({
      data: result,
      message: '注册成功',
      status: 201, // 创建资源返回201
    });
  },
  {
    methods: ['POST'], //此"POST"用于早期验证,统一错误处理：如果方法不匹配会自动返回 405 Method Not Allowed 错误。
    isPublic: true, //公开路由
    schema: {
      body: joi.object({
        phone: joi
          .string()
          .pattern(/^1[3-9]\d{9}$/) // 校验手机号
          .required(),
        password: joi
          .string()
          .min(8) // 密码至少 8 位数
          .required(),
      }),
    },
  },
);

export const POST = register;
export const dynamic = 'force-dynamic';
