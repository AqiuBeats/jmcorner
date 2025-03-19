import { EXP_TIME } from '@/utils/constants';
import jwt from 'jsonwebtoken';

// 确保环境变量存在，否则抛出错误
const accessTokenSecret = process.env.NEXT_PUBLIC_JWT_SECRET;
if (!accessTokenSecret) {
  throw new Error('Environment variable NEXT_PUBLIC_JWT_SECRET is not defined');
}

const verifyToken = async (
  req: { headers: { get: (key: string) => string | null } },
  isJwt: boolean,
) => {
  try {
    const token = req.headers.get('authorization');
    if (!token) {
      throw new Error('Authorization token is missing');
    }

    // 使用类型断言确保 secret 不为 undefined
    const decoded = jwt.verify(token, accessTokenSecret as jwt.Secret);
    const id = (decoded as { id: string }).id;

    return Promise.resolve(id);
  } catch (error) {
    if (isJwt) {
      throw error;
    }
    return null; // 如果不抛出错误，返回 null 或其他默认值
  }
};

const createAccessToken = (payload: object) => {
  // 使用类型断言确保 secret 不为 undefined
  return jwt.sign(payload, accessTokenSecret as jwt.Secret, {
    expiresIn: EXP_TIME,
  });
};

export const auth = {
  verifyToken,
  createAccessToken,
};
