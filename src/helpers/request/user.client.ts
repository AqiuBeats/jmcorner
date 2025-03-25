'use client';

import { queryClient } from '@/components/providers/QueryProviderWrapper';
import { toast } from 'sonner';
import {
  // useGetData,
  usePostData,
  // usePatchData,
  // useDeleteData,
} from '@/helpers/request/client';
import { User } from '@prisma/client';
import useAuthStore from '@/hooks/useAuthStore'; // 导入 Zustand store

interface LoginResponse {
  code: number;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

interface LoginData {
  phone: string;
  password: string;
}

interface LoginError {
  message: string;
  status?: number;
  errors?: {
    phone?: string[];
    password?: string[];
  };
}

//用户登录
const useLoginMutation = () => {
  const { setToken, setUser } = useAuthStore();

  return usePostData<LoginResponse, LoginData>('/api/auth/login', {
    onSuccess: (data) => {
      let response = data.data;
      // 更新用户数据缓存
      queryClient.setQueryData(['User'], response.user);
      setToken(response.token);
      setUser(response.user);
      toast.success('登录成功!');
    },
    onError: (error: LoginError) => {
      toast.error('登录失败:' + error.message);
    },
    onSettled: () => {
      // 确保最终刷新用户数据
      queryClient.invalidateQueries({ queryKey: ['User'] });
    },
  });
};

//注册用户
const useCreateUserMutation = () => {
  return usePostData<LoginResponse, LoginData>('/api/auth/register', {
    onSuccess: (data) => {
      let response = data.data;
      // 更新用户数据缓存
      queryClient.setQueryData(['User'], response.user);
      toast.success('注册成功!');
    },
    onError: (error: LoginError) => {
      toast.error('注册失败:' + error.message);
    },
    onSettled: () => {
      // 确保最终刷新用户数据
      queryClient.invalidateQueries({ queryKey: ['User'] });
    },
  });
};

// const useGetUserInfoQuery = () => {
//   return useQuery(['User'], () => apiService.get('/api/auth/user'), {
//     onSuccess: (data) => {
//       useUserStore.getState().setUser(data);
//     },
//     providesTags: ['User'],
//   });
// };

// const useGetUsersQuery = ({ page }: { page: number }) => {
//   return useQuery(['User', page], () => apiService.get(`/api/user?page=${page}`), {
//     providesTags: (result: unknown) =>
//       result
//         ? [
//             ...result.data.users.map(({ _id }: { _id: string }) => ({
//               type: 'User',
//               id: _id,
//             })),
//             'User',
//           ]
//         : ['User'],
//   });
// };

// const useEditUserMutation = () => {
//   const queryClient = useQueryClient();
//   return useMutation(
//     ({ body }: { body: any }) => apiService.patch('/api/user', body),
//     {
//       onSuccess: (_, { body }) => {
//         queryClient.invalidateQueries([{ type: 'User', id: body._id }]);
//       },
//     }
//   );
// };

// const useDeleteUserMutation = () => {
//   const queryClient = useQueryClient();
//   return useMutation(
//     ({ id }: { id: string }) => apiService.delete(`/api/user/${id}`),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['User']);
//       },
//     }
//   );
// };

export {
  useLoginMutation,
  //   useGetUserInfoQuery,
  useCreateUserMutation,
  //   useGetUsersQuery,
  //   useDeleteUserMutation,
  //   useEditUserMutation,
  //   useUserStore,
  //   queryClient,
};
