//代码生成模块类型
export interface DataSourceItem {
  id: number;
  createTime: string;
  updateTime: string;
  name: string;
  dbType: string;
  host: string;
  port: number;
  username: string;
  password: string;
  schemaName: string | null;
  status: boolean;
}
