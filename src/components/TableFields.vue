<script setup lang="ts">

interface Field {
  id: number
  name: string
  type: string
  entityType: string
  isEntityField: boolean
}

const props = defineProps<{
  fields: Field[]
}>()

const emit = defineEmits(['update:fields'])

const entityTypes = ['String', 'Number', 'Boolean', 'Date', 'Object']

const updateField = (index: number, field: Partial<Field>) => {
  const updatedFields = [...props.fields]
  updatedFields[index] = { ...updatedFields[index], ...field }
  emit('update:fields', updatedFields)
}
</script>

<template>
  <div class="table-fields">
    <table>
      <thead>
        <tr>
          <th>序号</th>
          <th>字段名称</th>
          <th>字段类型</th>
          <th>实体类类型</th>
          <th>是否实体类字段</th>
        </tr>
      </thead>
      <tbody v-if="props.fields && props.fields.length > 0">
        <tr v-for="(field, index) in props.fields" :key="field.id">
          <td>{{ index + 1 }}</td>
          <td>{{ field.name }}</td>
          <td>{{ field.type }}</td>
          <td>{{ field.entityType }}</td>
          <td>
            <select
              :value="field.isEntityField"
              @change="(e: Event) => updateField(index, { isEntityField: (e.target as HTMLSelectElement).value === 'true' })"
            >
              <option :value="true">是</option>
              <option :value="false">否</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f2f2f2;
}
input, select {
  width: 100%;
  padding: 5px;
}
.actions {
  display: flex;
  gap: 10px;
}
button {
  padding: 8px 12px;
  cursor: pointer;
}
</style>
