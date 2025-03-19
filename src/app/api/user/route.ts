import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    const skip = (page - 1) * pageSize;

    const users = await prisma.user.findMany({
      skip,
      take: pageSize,
      select: {
        id: true,
        phone: true,
        email: true,
        name: true,
        nickname: true,
        age: true,
        role: true,
        gender: true,
        height: true,
        education: true,
        occupation: true,
        income: true,
        region: true,
        maritalStatus: true,
        hobbies: true,
        photos: true,
        constellation: true,
        mbti: true,
        createdAt: true,
        updatedAt: true,
        isProfileVisible: true,
      },
    });

    const totalUsers = await prisma.user.count();

    res.status(200).json({
      users,
      pagination: {
        page,
        pageSize,
        totalPages: Math.ceil(totalUsers / pageSize),
        totalUsers,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}