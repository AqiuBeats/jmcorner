import { usersRepo } from '@/helpers';
import { apiHandler, setJson } from '@/helpers/api';
import joi from 'joi';

const register = apiHandler(
  async (req: { json: () => any }) => {
    const body = await req.json();
    const result = await usersRepo.create(body);
    return setJson({
      data: result,
    });
  },
  {
    schema: joi.object({
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
);

export const POST = register;
export const dynamic = 'force-dynamic';
