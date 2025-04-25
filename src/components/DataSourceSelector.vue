<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { listDataSource, listDataBase, listTable } from '@/apis/GenCode'
import type { DataSourceItem } from '@/types/codegen';
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
}

const emit = defineEmits(['table-selected'])

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
}

const fetchTableFields = async () => {
  if (!selectedTable.value) return

  // TODO: 调用API获取表字段
  // 模拟数据
  const mockFields = [
    { id: 1, name: 'id', type: 'int', entityType: 'Long', isEntityField: true },
    { id: 2, name: 'username', type: 'varchar', entityType: 'String', isEntityField: true },
    { id: 3, name: 'created_at', type: 'datetime', entityType: 'Date', isEntityField: false }
  ]

  const selectedTableName = tables.value.find(t => t.value === selectedTable.value)?.label || ''
  emit('table-selected', selectedTableName, mockFields)
}
</script>

<template>
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
