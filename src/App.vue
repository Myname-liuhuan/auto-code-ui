<script setup lang="ts">
import DataSourceSelector from '@/components/DataSourceSelector.vue'
import TableFields from '@/components/TableFields.vue'
</script>

<template>
  <div class="app-container">
    <h1>数据库代码生成器</h1>
    <DataSourceSelector />
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
