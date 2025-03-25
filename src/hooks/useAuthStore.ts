'use client';

import { User } from '@prisma/client';
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  clearToken: () => void; // 新增：清除 token
  isTokenExpired: () => boolean; // 新增：检查 token 是否过期
  getTokenExpiration: () => string | null; // 新增：获取 token 过期时间
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token:
    typeof window !== 'undefined'
      ? localStorage.getItem('token') || null
      : null, // 条件检查
  setUser: (user: User) => set({ user }),

  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token); // 存储到 localStorage
    }
    set({ token });
  },

  clearToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token'); // 移除 localStorage
    }
    set({ token: null });
  },

  isTokenExpired: () => {
    const { token } = get();
    if (!token) return true; // 如果没有 token，视为已过期

    try {
      // 解析 JWT 的 payload 部分
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp; // 获取过期时间（秒）
      const currentTime = Math.floor(Date.now() / 1000); // 当前时间（秒）
      if (currentTime > exp) {
        get().clearToken(); // 如果 token 已过期，自动清除
        return true;
      }

      return false; // token 未过期
    } catch (error) {
      console.error('Failed to parse token:', error);
      return true; // 如果解析失败，视为已过期
    }
  },

  getTokenExpiration: () => {
    const { token } = get();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      return new Date(exp * 1000).toLocaleString(); // 转换为本地时间字符串
    } catch (error) {
      console.error('Failed to parse token:', error);
      return null;
    }
  },
}));

export default useAuthStore;
