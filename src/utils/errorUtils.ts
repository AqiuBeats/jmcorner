/* eslint-disable @typescript-eslint/no-explicit-any */

//获取error并 返回字符串(兼容React Query的error)
export const errorToString = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else if (typeof error === 'object' && error !== null) {
    if (
      (error as any).response &&
      (error as any).response.data &&
      (error as any).response.data.message
    ) {
      return (error as any).response.data.message;
    }
    return JSON.stringify(error);
  } else {
    return String(error);
  }
};
