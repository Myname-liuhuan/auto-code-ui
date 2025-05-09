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
  entityType: string;
  columnComment: string;
}

/** 表字段生成配置 DTO（用于请求参数） */
export interface CodeGenColumnSettingDTO {
  columnName: string;
  columnType?: string;
  entityType: string;
  isEntityField?: boolean;
}

/** 整体代码生成配置 DTO */
export interface CodeGenerateDTO {
  dataSourceId: string;
  dbName: string;
  tableName: string;
  packageName: string;
  columnSettingList: CodeGenColumnSettingDTO[];
}
