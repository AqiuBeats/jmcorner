//获取error并 返回字符串(兼容React Query的error)
export const errorToString = (error: any) => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else if (typeof error === 'object' && error !== null) {
    return JSON.stringify(error);
  } else {
    return String(error);
  }
};

