// 定义接口以明确参数结构
interface SetJsonParams {
  code?: number; // 可选属性，类型为 number
  message?: string; // 可选属性，类型为 string
  data?: any; // 可选属性，类型为 any（可根据实际需求调整）
}

// 修复后的函数
const setJson = ({ code, message, data }: SetJsonParams = {}) => {
  return {
    code: code ?? 0, // 使用 nullish coalescing operator 避免 undefined
    message: message ?? 'ok',
    data: data ?? null,
  };
};

export { setJson };
