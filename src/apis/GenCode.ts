import request from '@/utils/request';

// 返回的字段结构
export interface CommonResult {
  code: number;
  message: string;
  data: JSON;
}

// 获取数据源列表
export const listDataSource = () => {
  return request<CommonResult>({
    url: '/api/codegenDataSource/listDataSource',
    method: 'GET'
  });
};

// 登录接口
export interface LoginParams {
  username: string;
  password: string;
}

export const login = (data: LoginParams) => {
  return request<{ token: string }>({
    url: '/user/login',
    method: 'POST',
    data
  });
};
