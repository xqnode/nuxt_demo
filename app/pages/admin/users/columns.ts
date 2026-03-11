// app/pages/admin/users/columns.ts
import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'

export interface User {
  id: number
  username: string
  name: string | null
  avatar: string | null
  status: number | null
  createdAt: string | null
}

function formatDate(val: string | null) {
  if (!val) return '—'
  return new Date(val).toLocaleDateString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  })
}

export function createColumns(options: {
  onEdit: (user: User) => void
  onResetPassword: (user: User) => void
  onDelete: (user: User) => void
  onToggleStatus: (user: User) => void
}): ColumnDef<User>[] {
  return [
    {
      accessorKey: 'username',
      header: '账号',
      cell: ({ row }) => {
        const user = row.original
        return h('div', { class: 'flex items-center gap-2.5' }, [
          h('div', {
            class: 'w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden',
          }, user.avatar
            ? h('img', { src: user.avatar, class: 'w-full h-full object-cover' })
            : h('span', { class: 'text-xs font-medium text-primary' }, user.username?.[0]?.toUpperCase())
          ),
          h('span', { class: 'text-sm font-medium' }, user.username),
        ])
      },
    },
    {
      accessorKey: 'name',
      header: '名称',
      cell: ({ row }) => h('span', { class: 'text-sm text-muted-foreground' }, row.original.name || '—'),
    },
    {
      accessorKey: 'status',
      header: '状态',
      cell: ({ row }) => {
        const user = row.original
        const isActive = user.status === 1
        return h('span', {
          class: [
            'inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium cursor-pointer select-none transition-opacity hover:opacity-70',
            isActive
              ? 'bg-green-50 text-green-600 border border-green-200'
              : 'bg-gray-100 text-gray-400 border border-gray-200',
          ],
          onClick: () => options.onToggleStatus(user),
        }, [
          h('span', {
            class: ['w-1.5 h-1.5 rounded-full', isActive ? 'bg-green-500' : 'bg-gray-400'],
          }),
          isActive ? '启用' : '禁用',
        ])
      },
    },
    {
      accessorKey: 'createdAt',
      header: '创建时间',
      cell: ({ row }) => h('span', { class: 'text-sm text-muted-foreground' }, formatDate(row.original.createdAt)),
    },
    {
      id: 'actions',
      header: '操作',
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original
        return h('div', { class: 'flex items-center gap-3' }, [
          h('button', {
            class: 'text-sm text-primary hover:text-primary/80 transition-colors cursor-pointer',
            onClick: () => options.onEdit(user),
          }, '编辑'),
          h('span', { class: 'text-border text-xs' }, '|'),
          h('button', {
            class: 'text-sm text-primary hover:text-primary/80 transition-colors cursor-pointer',
            onClick: () => options.onResetPassword(user),
          }, '重置密码'),
          h('span', { class: 'text-border text-xs' }, '|'),
          h('button', {
            class: 'text-sm text-destructive hover:text-destructive/80 transition-colors cursor-pointer',
            onClick: () => options.onDelete(user),
          }, '删除'),
        ])
      },
    },
  ]
}