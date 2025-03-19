import axios, { AxiosResponse } from 'axios';
import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';
import useAuthStore from '@/hooks/useAuthStore'; // 导入 Zustand store

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: '', // 你的 API 基础 URL
});

// 拦截请求，添加 token
apiClient.interceptors.request.use((config) => {
  const token = (useAuthStore.getState() as { token?: string })?.token; // 从 Zustand 获取 token
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// 获取数据的函数
const getData = async <T>(url: string): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.get(url);
  return response.data;
};

// 提交数据的函数
const postData = async <T, U>(url: string, data: U): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.post(url, data);
  return response.data;
};

//修改数据的函数
const patchData = async <T, U>(url: string, data: U): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.patch(url, data);
  return response.data;
};
// 删除数据的函数
const deleteData = async <T>(url: string): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.delete(url);
  return response.data;
};

// 自定义 Hook 用于获取数据
export const useGetData = <T>(url: string): UseQueryResult<T> => {
  return useQuery({
    queryKey: [url], // 明确指定 queryKey
    queryFn: () => getData<T>(url), // 使用 queryFn
  });
};

// 自定义 Hook 用于提交数据
export const usePostData = <T, U>(
  url: string,
  data: U,
  onSuccess?: (data: T) => void,
): UseMutationResult<T, unknown, U> => {
  return useMutation({
    mutationFn: (data: U) => postData<T, U>(url, data), // 使用 mutationFn
    onSuccess,
  });
};

// 自定义 Hook 用于修改数据
export const usePatchData = <T, U>(
  url: string,
  data: U,
): UseMutationResult<T, unknown, U> => {
  return useMutation({
    mutationFn: (data: U) => patchData<T, U>(url, data), // 使用 mutationFn
  });
};

// 自定义 Hook 用于删除数据
export const useDeleteData = <T>(url: string): UseMutationResult<T> => {
  return useMutation({
    mutationFn: () => deleteData<T>(url), // 使用 mutationFn
  });
};
