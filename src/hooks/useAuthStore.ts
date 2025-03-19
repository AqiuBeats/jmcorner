import { User } from '@prisma/client';
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  setUser: (user: User) => set({ user }), //断言其必有token字段
}));

export default useAuthStore;
