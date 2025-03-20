import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client';
import { auth } from '@/helpers';
import { decodeAESData } from '@/utils/aesUtils';

//获取所有用户
const getAll = async ({
  page_index,
  page_size,
}: {
  page_index: number | string;
  page_size: number | string;
}) => {
  const page = parseInt(page_index as string) || 1;
  const pageSize = parseInt(page_size as string) || 10;
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

  const usersLength = await prisma.user.count();

  return {
    users,
    usersLength,
    pagination: {
      currentPage: page,
      nextPage: page + 1,
      previousPage: page - 1,
      hasNextPage: pageSize * page < usersLength,
      hasPreviousPage: page > 1,
      lastPage: Math.ceil(usersLength / pageSize),
    },
  };
};

//获取单个用户,并对其进行修改
const update = async ({ id, params }: { id: string; params: any }) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: id, // 通过用户 ID 定位要更新的用户
      },
      data: params,
    });
    if (!user) throw '用户不存在';
  } catch (error) {
    throw '更新用户信息失败:' + error;
  }
};

//创建用户，并返回token
const create = async (params: User) => {
  const { phone, password } = params; //password属于已加密字段
  const user = await prisma.user.findUnique({
    where: { phone: phone },
  });
  if (user) {
    throw new Error(`${phone} 用户已存在`);
  }
  //密码解码
  const decode_pwd = decodeAESData(password);
  const hashedPassword = await bcrypt.hash(decode_pwd, 10);
  const newUser = await prisma.user.create({
    data: { phone, password: hashedPassword },
  });
  const token = auth.createAccessToken({ id: newUser.id });

  return {
    user: {
      id: newUser.id,
      phone: newUser.phone,
    },
    token,
  };
};

//登录校验用户(password属于已加密字段)
const authenticate = async (params: User) => {
  const { phone, password } = params;
  const user = await prisma.user.findUnique({
    where: { phone: phone },
  });
  if (!user) {
    // throw `${phone} 用户不存在`;//默认400
    throw new Error(`${phone} 用户不存在`); //默认500
  }
  //密码校验
  const decode_pwd = decodeAESData(password);
  if (!user || !(await bcrypt.compare(decode_pwd, user.password))) {
    throw new Error('密码错误');
  }
  const token = auth.createAccessToken({ id: user.id });
  return {
    user: {
      id: user.id,
      phone: user.phone,
    },
    token,
  };
};

//删除用户
const _delete = async (id: string) => {
  //先查再删
  const user = await prisma.user.findUnique({
    where: { id: id },
  });
  if (!user) {
    throw new Error('用户不存在');
  }
  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id: id, // 通过用户 ID 定位要删除的用户
      },
    });
    throw `${deletedUser.phone}用户已删除`;
  } catch (error) {
    throw new Error('删除用户失败:' + error);
  }
};

//重置密码(password属于已加密字段)
const resetPassword = async ({
  id,
  password,
}: {
  id: string;
  password: string;
}) => {
  //先查再删
  const user = await prisma.user.findUnique({
    where: { id: id },
  });
  if (!user) {
    throw new Error('用户不存在');
  }
  //密码解码 本地aes加密字段=>进行服务端密码解密
  const decode_pwd = decodeAESData(password);
  //正常密码获取后=>再进行加密=> 更新用户密码
  const hashedPassword = await bcrypt.hash(decode_pwd, 10);
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: id, // 通过用户 ID 定位要更新的用户
      },
      data: {
        password: hashedPassword, // 更新为哈希后的密码
      },
    });
    // if (updatedUser) {
    //   throw '重置密码成功';
    // }
  } catch (error) {
    throw new Error('重置密码失败:' + error);
  }
};

//根据id获取用户信息
const getById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });
    if (!user) {
      throw new Error('用户不存在');
    }
    return user;
  } catch {
    throw 'User Not Found';
  }
};

export const usersRepo = {
  create,
  getAll,
  getById, //可以平替getOne
  // getOne,
  update,
  delete: _delete,
  resetPassword,
  authenticate,
};
