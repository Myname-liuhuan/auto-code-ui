//代码生成模块类型
export interface DataSourceItem {
  id: string;
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

/** 表的列属性 */
export interface TableColumn {
  columnName: string;
  columnType: string;
  columnComment: string;
}
