/* eslint-disable @typescript-eslint/no-explicit-any */

import joi from 'joi';
const validateWithJoi = (
  schema: joi.Schema,
  data: any,
  type: 'body' | 'query' | 'params',
) => {
  // 配置验证选项
  const options: joi.ValidationOptions = {
    abortEarly: false, // 返回所有错误而不是在第一个错误时停止
    allowUnknown: true, // 允许未知字段
    stripUnknown: false, // 不删除未知字段
  };

  const { error, value } = schema.validate(data, options);

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message.replace(/['"]/g, ''),
      type: detail.type,
    }));

    return {
      isValid: false,
      errors,
      formattedMessage: `${type} validation failed: ${errors.map((e) => e.message).join(', ')}`,
    };
  }

  return {
    isValid: true,
    value, // 返回经过转换的值（如字符串转数字等）
  };
};

export default validateWithJoi;
