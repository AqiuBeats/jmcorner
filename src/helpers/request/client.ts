import axios, { AxiosError, AxiosResponse } from 'axios';
import {
  useQuery,
  useMutation,
  UseMutationResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import useAuthStore from '@/hooks/useAuthStore'; // 导入 Zustand store

interface StandardError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

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

/**
 * 封装的 GET 请求函数
 * @template T 期望的响应数据类型
 * @param url 请求地址
 * @throws 抛出标准化错误对象
 */
const getData = async <T>(url: string): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.get(url, {
      headers: { Accept: 'application/json' },
      timeout: 10000, // 10秒超时
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{
      message?: string;
      errors?: Record<string, string[]>;
    }>;

    throw {
      message: axiosError.response?.data?.message || '获取数据失败',
      status: axiosError.response?.status,
      errors: axiosError.response?.data?.errors,
    } satisfies StandardError; // 类型安全验证
  }
};

/**
 * 通用的 POST 请求函数
 * @template T 响应数据类型
 * @template U 请求体类型
 * @param url 请求地址
 * @param data 请求数据
 * @throws 抛出标准化错误对象
 */
const postData = async <T, U>(url: string, data: U): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.post(url, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    // 标准化错误处理
    const axiosError = error as AxiosError<{
      message?: string;
      errors?: Record<string, string[]>;
    }>;

    throw {
      message: axiosError.response?.data?.message || '请求失败',
      status: axiosError.response?.status,
      errors: axiosError.response?.data?.errors,
    };
  }
};

/**
 * 封装的 PATCH 请求函数
 * @template T 响应数据类型
 * @template U 请求体类型
 * @param url 请求地址
 * @param data 请求数据
 * @throws 抛出标准化错误对象
 */
const patchData = async <T, U>(url: string, data: U): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.patch(url, data, {
      headers: {
        'Content-Type': 'application/json',
        // 可添加其他默认头
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{
      message?: string;
      errors?: Record<string, string[]>;
    }>;

    // 抛出与 postData 完全一致的错误结构
    throw {
      message: axiosError.response?.data?.message || '更新数据失败',
      status: axiosError.response?.status,
      errors: axiosError.response?.data?.errors,
    };
  }
};

/**
 * 封装的 DELETE 请求函数
 * @template T 期望的响应数据类型
 * @param url 请求地址（通常包含资源ID）
 * @throws 抛出标准化错误对象
 */
const deleteData = async <T>(url: string): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.delete(url, {
      headers: {
        Accept: 'application/json', // 声明期望的响应格式
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{
      message?: string;
      errors?: Record<string, string[]>;
    }>;

    // 抛出与 postData 完全一致的错误结构
    throw {
      message: axiosError.response?.data?.message || '删除资源失败',
      status: axiosError.response?.status,
      errors: axiosError.response?.data?.errors,
    };
  }
};

/**
 * 封装的GET请求React Query Hook
 * @template T 响应数据类型
 * @param url 请求地址
 * @param queryKey 查询键
 * @param config 配置项（包含React Query选项和回调）
 */
export const useGetData = <T>(
  url: string,
  queryKey: string[],
  config?: {
    // React Query标准配置
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;

    // 统一回调（与usePostData完全一致）
    onSuccess?: (data: T) => void;
    onError?: (error: StandardError) => void;
    onSettled?: (data: T | undefined, error: StandardError | null) => void;
  },
) => {
  const options: UseQueryOptions<T, StandardError> = {
    queryKey,
    queryFn: () => getData<T>(url), // 复用基础getData
    ...config, // 展开所有配置项
    // 增强的错误处理（可覆盖config中的onError）
    // onError: (error: StandardError) => {
    //   console.error(`GET ${url} failed [${error.status}]:`, error.message);
    //   config?.onError?.(error);
    // },
  };

  return useQuery(options);
};

/**
 * 封装 POST 请求的 React Query Hook
 * @template T 响应数据类型
 * @template U 请求体类型
 * @param url 固定的请求地址
 * @param initialData 初始数据（可选，用于乐观更新）
 * @param config 扩展配置（如成功回调、错误处理等）
 */
export const usePostData = <T, U>(
  url: string,
  config?: {
    onSuccess?: (data: T) => void;
    onError?: (error: StandardError) => void;
    onSettled?: (data: T | undefined, error: StandardError | null) => void;
    optimisticUpdate?: (variables: U) => void;
  },
): UseMutationResult<T, StandardError, U> => {
  return useMutation<T, StandardError, U>({
    mutationFn: (data: U) => postData<T, U>(url, data),

    // 乐观更新示例（可选）
    onMutate: config?.optimisticUpdate,

    // 成功回调
    onSuccess: (data) => {
      config?.onSuccess?.(data);
    },

    // 统一错误处理
    onError: (error) => {
      console.error(`POST ${url} failed:`, error.message);
      config?.onError?.(error);
    },
  });
};

/**
 * 封装 PATCH 请求的 React Query Hook
 * @template T 响应数据类型
 * @template U 请求体类型
 * @param url 固定的请求地址
 * @param initialData 初始数据（可选，用于乐观更新）
 * @param config 扩展配置（如成功回调、错误处理等）
 */
export const usePatchData = <T, U>(
  url: string,
  config?: {
    onSuccess?: (data: T) => void;
    onError?: (error: StandardError) => void;
    onSettled?: (data: T | undefined, error: StandardError | null) => void;
    optimisticUpdate?: (variables: U) => void;
  },
): UseMutationResult<T, StandardError, U> => {
  return useMutation<T, StandardError, U>({
    mutationFn: (data: U) => patchData<T, U>(url, data),

    // 乐观更新示例（可选）
    onMutate: config?.optimisticUpdate,

    // 成功回调
    onSuccess: (data) => {
      config?.onSuccess?.(data);
    },

    // 统一错误处理
    onError: (error) => {
      console.error(`PATCH ${url} failed:`, error.message);
      config?.onError?.(error);
    },

    // 无论成功或失败都会执行的回调
    onSettled: (data, error) => {
      config?.onSettled?.(data, error);
    },
  });
};

/**
 * 封装的DELETE请求React Query Hook
 * @template T 响应数据类型
 * @param url 请求地址
 * @param queryKey 查询键
 * @param config 配置项（包含React Query选项和回调）
 */
export const useDeleteData = <T>(
  url: string,
  config?: {
    // React Query 标准配置
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;

    // 统一回调（与 usePostData 完全一致）
    onSuccess?: (data: T) => void;
    onError?: (error: StandardError) => void;
    onSettled?: (data: T | undefined, error: StandardError | null) => void;
  },
): UseMutationResult<T, StandardError, void> => {
  return useMutation<T, StandardError, void>({
    mutationFn: () => deleteData<T>(url),

    // 成功回调
    onSuccess: (data) => {
      config?.onSuccess?.(data);
    },

    // 统一错误处理
    onError: (error) => {
      console.error(`DELETE ${url} failed [${error.status}]:`, error.message);
      config?.onError?.(error);
    },

    // 无论成功或失败都会执行的回调
    onSettled: (data, error) => {
      config?.onSettled?.(data, error);
    },
  });
};
