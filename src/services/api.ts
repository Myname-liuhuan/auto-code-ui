import type { Field } from '@/types'

export async function generateCode(table: string, fields: Field[]) {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ table, fields })
    })

    if (!response.ok) {
      throw new Error('代码生成失败')
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${table}_code.zip`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    a.remove()

    return { success: true }
  } catch (error) {
    console.error('API请求错误:', error)
    throw error
  }
}
