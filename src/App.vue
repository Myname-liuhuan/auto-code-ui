<script setup lang="ts">
import { ref } from 'vue'
import DataSourceSelector from '@/components/DataSourceSelector.vue'
import TableFields from '@/components/TableFields.vue'

const fields = ref<any[]>([])
const selectedTableName = ref('')

const handleTableSelected = (tableName: string, tableFields: any[]) => {
  selectedTableName.value = tableName
  fields.value = tableFields
}
</script>

<template>
  <div class="app-container">
    <h1>数据库代码生成器</h1>
    <DataSourceSelector @table-selected="handleTableSelected" />
    <TableFields :fields="fields" />
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
</style>
