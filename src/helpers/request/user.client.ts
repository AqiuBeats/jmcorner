import { queryClient } from '@/components/providers/QueryProviderWrapper';
import {
  useGetData,
  usePostData,
  usePatchData,
  useDeleteData,
} from '@/helpers/request/client';

const useLoginMutation = () => {
  return usePostData('/api/auth/login', null, () => {
    queryClient.invalidateQueries({
      queryKey: ['User'],
    });
  });
};

//注册用户
const useCreateUserMutation = () => {
  return usePostData('/api/auth/register', null, () => {
    queryClient.invalidateQueries({
      queryKey: ['User'],
    });
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
//     providesTags: (result: any) =>
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
