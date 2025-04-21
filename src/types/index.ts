export interface Field {
  id: number
  name: string
  type: string
  entityType: string
  isEntityField: boolean
  required?: boolean
  defaultValue?: any
  [key: string]: any
}
