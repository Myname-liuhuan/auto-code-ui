import request from '@/utils/request';
import type { CodeGenerateDTO, DataSourceItem, TableColumn } from '@/types/codegen';


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

//获取数据库中表列表
export const listTable = (dataSourceId: string, database: string) => {
  return request<string[]>({
    url: '/api/codegenDataSource/listTable',
    method: 'GET',
    params: { dataSourceId , database}
  });
};

//获取表的所有行
export const listColumns = (dataSourceId: string, database: string, tableName :string) => {
  return request<TableColumn[]>({
    url: '/api/codegenDataSource/listColumns',
    method: 'GET',
    params: { dataSourceId , database, tableName}
  });
};

//下载文件
export const generateCodeByConfig = (data: CodeGenerateDTO) => {
  return request({
    url: '/api/codegen/generateCodeByConfig',
    method: 'POST',
    data,
    responseType: 'blob', // 设置响应类型为 blob
    timeout: 60000,
    transformResponse: (data, headers) => {
      return {
        data,
        headers
      };
    }
  });
};
