import jwt from 'jsonwebtoken';
import useAuthStore from '@/hooks/useAuthStore';


// 使用 Zustand 实现的 useVerify 函数
export default function useVerify(): boolean {
  const { token } = useAuthStore();
  if (!token) return false;
  let status: boolean = false;
  jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET as string, (err, decoded) => {
    if (err) status = false;
    if (decoded) status = true;
  });
  return status;
}