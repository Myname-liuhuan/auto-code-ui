<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { listDataSource } from '@/apis/GenCode'
import type { DataSourceItem } from '@/types/codegen';

const dataSourceList = ref<DataSourceItem[]>([]);

onMounted(async () => {
  try {
    let data = await listDataSource()
    dataSourceList.value = data;
  } catch (error) {
    console.error('获取数据源失败:', error)
  }
})

const databases = ref<Array<{id: number, name: string}>>([])
const tables = ref<Array<{id: number, name: string}>>([])

const selectedSource = ref<number>()
const selectedDB = ref<number>()
const selectedTable = ref<number>()

const fetchDatabases = async () => {
  // TODO: 调用API获取数据库列表
  databases.value = [
    { id: 1, name: 'db1' },
    { id: 2, name: 'db2' }
  ]
}

const emit = defineEmits(['table-selected'])

const fetchTables = async () => {
  // TODO: 调用API获取表列表
  tables.value = [
    { id: 1, name: 'users' },
    { id: 2, name: 'products' }
  ]
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

  const selectedTableName = tables.value.find(t => t.id === selectedTable.value)?.name || ''
  emit('table-selected', selectedTableName, mockFields)
}
</script>

<template>
  <div class="selector-container">
    <div class="selector-item">
      <label>数据源:</label>
      <select v-model="selectedSource" @change="fetchDatabases">
        <option disabled value="">请选择数据源</option>
        <option v-for="source in dataSourceList" :key="source.id" :value="source.id">
          {{ source.name }}
        </option>
      </select>
    </div>

    <div class="selector-item">
      <label>数据库:</label>
      <select v-model="selectedDB" :disabled="!selectedSource" @change="fetchTables">
        <option disabled value="">请选择数据库</option>
        <option v-for="db in databases" :key="db.id" :value="db.id">
          {{ db.name }}
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
        <option disabled value="">请选择数据表</option>
        <option v-for="table in tables" :key="table.id" :value="table.id">
          {{ table.name }}
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
  gap: 10px;
}
select {
  padding: 8px;
  min-width: 150px;
}
</style>
