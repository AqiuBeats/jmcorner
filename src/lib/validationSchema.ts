import { z } from 'zod';

// 手机号校验规则
export const phoneSchema = z
  .string()
  .min(11, '手机号长度不能少于11位')
  .max(11, '手机号长度不能超过11位')
  .regex(/^1[3-9]\d{9}$/, '手机号格式不正确');

// 密码校验规则
export const passwordSchema = z
  .string()
  .min(8, '密码长度不能少于8位')
//   .regex(/[A-Z]/, '密码必须包含至少一个大写字母')
//   .regex(/[a-z]/, '密码必须包含至少一个小写字母')
//   .regex(/[0-9]/, '密码必须包含至少一个数字')
//   .regex(/[^A-Za-z0-9]/, '密码必须包含至少一个特殊字符');

// 注册请求体校验规则
export const registerSchema = z.object({
  phone: phoneSchema,
  password: passwordSchema,
});
