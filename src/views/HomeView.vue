<script setup lang="ts">
import { ref } from 'vue'
import DataSourceSelector from '@/components/DataSourceSelector.vue'
import TableFields from '@/components/TableFields.vue'

import type { Field } from '@/types'

const fields = ref<Field[]>([])
const selectedTable = ref('')

const handleTableSelect = (table: string, tableFields: Field[]) => {
  selectedTable.value = table
  fields.value = tableFields
}

const handleGenerate = async () => {
  try {
    // await generateCode(selectedTable.value, fields.value)
    alert('代码生成成功！')
  } catch (error) {
    console.error('生成错误:', error)
    alert('代码生成失败: ' + (error as Error).message)
  }
}
</script>

<template>
  <main class="container">
    <DataSourceSelector @table-selected="handleTableSelect" />
    <TableFields v-if="fields.length > 0" :fields="fields" />
    <button
      v-if="fields.length > 0"
      @click="handleGenerate"
      class="generate-btn"
    >
      生成代码
    </button>
  </main>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.generate-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.generate-btn:hover {
  background-color: #3aa876;
}
</style>
