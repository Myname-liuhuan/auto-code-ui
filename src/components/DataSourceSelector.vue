<script setup lang="ts">
import { ref, onMounted } from 'vue'

const codePackagePath = ref<string>('')
import { listDataSource, listDataBase, listTable, listColumns, generateCodeByConfig } from '@/apis/GenCode'
import type { DataSourceItem, TableColumn, CodeGenerateDTO } from '@/types/codegen';
import type { CommonSelectItem } from '@/types/common';

const dataSourceList = ref<DataSourceItem[]>([]);

onMounted(async () => {
  try {
    let data = await listDataSource()
    dataSourceList.value = data;
  } catch (error) {
    console.error('获取数据源失败:', error)
  }
})

const databases = ref<CommonSelectItem[]>([])
const tables = ref<CommonSelectItem[]>([])

const selectedSource = ref<string>('')
const selectedDB = ref<string>('')
const selectedTable = ref<string>('')

//datasourceChange事件
const fetchDatabases = async () => {
  if (!selectedSource.value){
    databases.value = []
    tables.value = []
    selectedDB.value = ''
    selectedTable.value = ''
  }else{
    //调用API获取数据库列表
    let data = await listDataBase(selectedSource.value)
    databases.value = data.map((item: string) => ({
      label: item,
      value: item
    }))
  }
  emit('clear-table')
}

const emit = defineEmits(['table-selected', 'clear-table'])

//databaseChange事件
const fetchTables = async () => {
  //调用API获取表列表
  if (!selectedDB.value) {
    tables.value = []
    selectedTable.value = ''
  } else {
    let data = await listTable(selectedSource.value, selectedDB.value)
    tables.value = data.map((item: string) => ({
      label: item,
      value: item
    }))
  }
  emit('clear-table')
}
//tableChange事件
const fetchTableFields = async () => {
  if (!selectedTable.value) return

  const data = await listColumns(selectedSource.value, selectedDB.value, selectedTable.value);
  fields.value = data.map((item: TableColumn, index: number) => ({
    id: index,
    name: item.columnName,
    type: item.columnType,
    entityType: item.entityType || 'String', // 默认String类型
    isEntityField: true
  }))

  const selectedTableName = tables.value.find(t => t.value === selectedTable.value)?.label || ''
  emit('table-selected', selectedTableName, fields.value)
}

const fields = ref<any[]>([])

const generateCode = async () => {
  if (!selectedSource.value || !selectedDB.value || !selectedTable.value || !codePackagePath.value) {
    alert('请填写完整信息')
    return
  }

  try {
    const columnSettings = fields.value.map((item: any) => ({
      columnName: item.name,
      entityType: item.entityType,
      isEntityField: item.isEntityField
    }))

    const params: CodeGenerateDTO = {
      dataSourceId: selectedSource.value,
      dbName: selectedDB.value,
      tableName: selectedTable.value,
      packageName: codePackagePath.value,
      columnSettingList: columnSettings
    }

    const response = await generateCodeByConfig(params)

    // 创建下载链接
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${selectedTable.value}_code.zip`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('生成代码失败:', error)
    alert('生成代码失败')
  }
}
</script>

<template>
  <div class="path-input">
    <label>要生成的包路径:</label>
    <input v-model="codePackagePath" placeholder="请输入代码包路径" />
  </div>
  <div class="action-buttons">
    <button @click="generateCode" :disabled="!selectedTable">生成代码</button>
  </div>
  <div class="selector-container">
    <div class="selector-item">
      <label>数据源:</label>
      <select v-model="selectedSource" @change="fetchDatabases">
        <option value="" >请选择数据源</option>
        <option v-for="source in dataSourceList" :key="source.id" :value="source.id">
          {{ source.name }}
        </option>
      </select>
    </div>

    <div class="selector-item">
      <label>数据库:</label>
      <select v-model="selectedDB" :disabled="!selectedSource" @change="fetchTables">
        <option value="">请选择数据库</option>
        <option v-for="db in databases" :key="db.value" :value="db.value">
          {{ db.label }}
        </option>
      </select>
    </div>

    <div class="selector-item">
      <label>数据表:</label>
      <select
        v-model="selectedTable"
        :disabled="!selectedDB"
        @change="fetchTableFields"
      >
        <option value="">请选择数据表</option>
        <option v-for="table in tables" :key="table.value" :value="table.value">
          {{ table.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.path-input {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}
.path-input label {
  min-width: 120px;
  text-align: right;
  white-space: nowrap;
  margin-right: 10px;
}
.path-input input {
  padding: 8px;
  min-width: 300px;
}

.action-buttons {
  margin-bottom: 15px;
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

.selector-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.selector-item {
  display: flex;
  align-items: center;
}
.selector-item label {
  min-width: 80px;
  text-align: right;
  white-space: nowrap;
  margin-right: 10px;
}
select {
  padding: 8px;
  min-width: 150px;
}
</style>
