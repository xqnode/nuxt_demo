// app/composables/useUserApi.ts
import type { User } from '~/types/user'

export function useUserApi() {
  return {
    // 获取列表
    list: (params: { keyword: string; page: number; pageSize: number }) =>
      $fetch<{ list: User[]; total: number }>('/api/users', { query: params }),

    // 新增
    create: (data: { username: string; password: string; name?: string; status: number; role: string }) =>
      $fetch('/api/users', { method: 'POST', body: data }),

    // 更新
    update: (id: number, data: { name?: string; status: number; role: string }) =>
      $fetch(`/api/users/${id}`, { method: 'PUT', body: data }),

    // 删除
    remove: (id: number) =>
      $fetch(`/api/users/${id}`, { method: 'DELETE' }),

    // 切换状态
    toggleStatus: (id: number, status: number) =>
      $fetch(`/api/users/${id}/status`, { method: 'PATCH', body: { status } }),

    // 重置密码
    resetPassword: (id: number) =>
      $fetch(`/api/users/${id}/reset-password`, { method: 'POST' }),
  }
}