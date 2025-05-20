<script setup lang="ts">
import { ref } from 'vue'
import DataSourceSelector from '@/components/DataSourceSelector.vue'
import TableFields from '@/components/TableFields.vue'
import { generateCodeByConfig } from '@/apis/GenCode'
import { saveAs } from 'file-saver';


const fields = ref<any[]>([])
const selectedTableName = ref('')
const selectedSource = ref('')
const selectedDB = ref('')
const selectedTable = ref('')
const codePackagePath = ref('')

const handleTableSelected = (tableName: string, tableFields: any[]) => {
  selectedTableName.value = tableName
  fields.value = tableFields
}

const generateCode = async () => {
  console.log('生成代码参数:', {
    source: selectedSource.value,
    db: selectedDB.value,
    table: selectedTable.value,
    path: codePackagePath.value
  })

  if (!selectedSource.value || !selectedDB.value || !selectedTable.value || !codePackagePath.value) {
    alert(`请填写完整信息:
    ${!selectedSource.value ? '• 请选择数据源\n' : ''}
    ${!selectedDB.value ? '• 请选择数据库\n' : ''}
    ${!selectedTable.value ? '• 请选择数据表\n' : ''}
    ${!codePackagePath.value ? '• 请输入包路径' : ''}`)
    return
  }


  const columnSettings = fields.value.map((item: any) => ({
    columnName: item.name,
    entityType: item.entityType,
    isEntityField: item.isEntityField
  }))

  const params = {
    dataSourceId: selectedSource.value,
    dbName: selectedDB.value,
    tableName: selectedTable.value,
    packageName: codePackagePath.value,
    columnSettingList: columnSettings
  }

  generateCodeByConfig(params).then((res: Blob) => {
    // 检查是不是 JSON 错误信息而非 zip 文件
    if (res.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const error = JSON.parse(reader.result as string);
            console.error('后端错误信息:', error);
          } catch (e) {
            console.error('解析错误信息失败:', e);
          }
        };
        reader.readAsText(res);
      } else {
        // 正常下载 zip
        const blob = new Blob([res], { type: 'application/zip' });
        saveAs(blob, 'generated-code.zip');
      }
    })
    .catch((err) => {
      console.error('请求失败:', err);
      console.error(err.response);
    });
}

const handleClearTable = () => {
  selectedTableName.value = ''
  fields.value = []
}
</script>

<template>
  <div class="app-container">
    <h1>数据库代码生成器</h1>
    <DataSourceSelector
      @table-selected="handleTableSelected"
      @clear-table="handleClearTable"
      v-model:source="selectedSource"
      v-model:db="selectedDB"
      v-model:table="selectedTable"
      v-model:path="codePackagePath"
    />
    <TableFields :fields="fields" />
    <div class="action-buttons">
      <button @click="generateCode" :disabled="!selectedTable">生成代码</button>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

.action-buttons {
  margin-top: 20px;
  text-align: right;
}

.action-buttons button {
  padding: 8px 16px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.action-buttons button:disabled {
  background-color: #c0c4cc;
  cursor: not-allowed;
}
</style>
