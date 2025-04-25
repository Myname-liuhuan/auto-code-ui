import request from '@/utils/request';
import type { DataSourceItem } from '@/types/codegen';


// 获取数据源列表
export const listDataSource = () => {
  return request<DataSourceItem[]>({
    url: '/api/codegenDataSource/listDataSource',
    method: 'GET',
  });
};

//获取数据库列表
export const listDataBase = (dataSourceId: string) => {
  return request<string[]>({
    url: '/api/codegenDataSource/listDataBase',
    method: 'GET',
    params: { dataSourceId }
  });
};
