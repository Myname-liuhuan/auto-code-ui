import request from '@/utils/request';
import type { CommonResult } from '@/types/common';
import type { DataSourceItem } from '@/types/codegen';


// 获取数据源列表
export const listDataSource = () => {
  return request<CommonResult<DataSourceItem[]>>({
    url: '/api/codegenDataSource/listDataSource',
    method: 'GET',
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
