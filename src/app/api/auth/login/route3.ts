import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // 确保导入你的 authOptions

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    // const { phone, password } = await req.json();
    const { phone, password } = req.body;
    console.log('phone', phone, password);
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
  } catch (error) {
    // return NextResponse.json({ error: 'Server error' }, { status: 500 });
    return res.status(500).json({ error: 'Server error' });
  }
}
