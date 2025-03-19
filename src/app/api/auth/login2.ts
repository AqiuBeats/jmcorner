import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // 确保导入你的 authOptions

export default async function login2(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, password } = req.body;
  console.log('Received login request:', { phone, password });

  if (!phone || !password) {
    return res.status(400).json({ error: 'phone and password are required' });
  }

  // 使用 getServerSession 来处理身份验证
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    return res.status(200).json({ success: 'Logged in' });
  } else {
    // 如果身份验证失败，返回错误
    return res.status(401).json({ error: 'Invalid credentials' });
  }
}
