//公共类型

export interface CommonResult<T = any> {
  code: number;
  message: string;
  data: T;
}

