<!-- pages/admin/users.vue -->
<template>
  <div class="space-y-4">

    <!-- 顶部工具栏 -->
    <div class="flex items-center justify-between">
      <UInput v-model="searchKeyword" placeholder="搜索账号 / 名称" icon="i-lucide-search" class="w-64"
        @update:model-value="handleSearch" />
      <UButton icon="i-lucide-plus" @click="openModal()">新增用户</UButton>
    </div>

    <!-- 表格 -->
    <UCard :ui="{ body: 'p-0 overflow-hidden' }">
      <UTable :data="list" :columns="columns" :loading="loading">
        <template #role-cell="{ row }">
          <UBadge :color="row.original.role === 'admin' ? 'error' : 'info'" variant="subtle" class="rounded-full">
            {{ row.original.role === 'admin' ? '管理员' : '普通用户' }}
          </UBadge>
        </template>

        <template #avatar-cell="{ row }">
          <UAvatar :src="row.original.avatar ?? undefined" :alt="row.original.name ?? row.original.username" size="sm"
            class="cursor-pointer" @click="avatarUrl = row.original.avatar ?? ''; avatarModalVisible = true" />
        </template>

        <template #status-cell="{ row }">
          <UBadge :color="isEnabled(row.original) ? 'success' : 'neutral'" variant="subtle"
            class="rounded-full select-none cursor-pointer" @click="toggleStatus(row.original)">
            {{ isEnabled(row.original) ? '启用' : '禁用' }}
          </UBadge>
        </template>

        <template #actions-cell="{ row }">
          <div class="flex items-center gap-0.5 whitespace-nowrap">
            <UTooltip text="编辑">
              <UButton class="px-1" icon="i-lucide-pencil" color="neutral" variant="ghost" size="xs"
                @click="openModal(row.original)" />
            </UTooltip>
            <UTooltip :text="isEnabled(row.original) ? '禁用' : '启用'">
              <UButton class="px-1" :icon="isEnabled(row.original) ? 'i-lucide-ban' : 'i-lucide-circle-check'"
                :color="isEnabled(row.original) ? 'warning' : 'success'" variant="ghost" size="xs"
                @click="toggleStatus(row.original)" />
            </UTooltip>
            <UTooltip text="重置密码">
              <UButton class="px-1" icon="i-lucide-key-round" color="neutral" variant="ghost" size="xs"
                @click="confirmResetPassword(row.original)" />
            </UTooltip>
            <UTooltip text="删除">
              <UButton class="px-1" icon="i-lucide-trash-2" color="error" variant="ghost" size="xs"
                @click="confirmDelete(row.original)" />
            </UTooltip>
          </div>
        </template>

        <template #empty>
          <div class="flex flex-col items-center justify-center py-12 text-slate-400">
            <UIcon name="i-lucide-users" class="size-10 mb-2 opacity-20" />
            <p class="text-sm">暂无用户信息</p>
          </div>
        </template>

      </UTable>

      <!-- 分页 -->
      <div class="px-4 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
        <p class="text-xs text-slate-500">共 {{ total }} 条记录</p>
        <UPagination v-model:page="page" :total="total" :items-per-page="pageSize" size="sm" @update:page="fetchList" />
      </div>
    </UCard>

    <!-- 新增 / 编辑弹窗 -->
    <UModal v-model:open="modalVisible" :title="editingUser ? '编辑用户' : '新增用户'">
      <template #body>
        <UForm :schema="formSchema" :state="formState" class="space-y-4" @submit="onSubmit">
          <UFormField label="账号" name="username" required>
            <UInput v-model="formState.username" placeholder="登录账号" :disabled="!!editingUser" class="w-full" />
          </UFormField>

          <UFormField v-if="!editingUser" label="密码" name="password" required>
            <UInput v-model="formState.password" type="password" placeholder="至少 6 位字符" class="w-full" />
          </UFormField>

          <UFormField label="显示名称" name="name">
            <UInput v-model="formState.name" placeholder="用户昵称" class="w-full" />
          </UFormField>

          <UFormField label="角色" name="role">
            <div class="flex gap-2">
              <UButton v-for="item in roleOptions" :key="item.value"
                :variant="formState.role === item.value ? 'solid' : 'outline'" color="neutral" size="sm"
                @click="formState.role = item.value">
                {{ item.label }}
              </UButton>
            </div>
          </UFormField>

          <UFormField label="账号状态" name="status">
            <div class="flex gap-2">
              <UButton v-for="item in statusOptions" :key="item.value"
                :variant="formState.statusStr === item.value ? 'solid' : 'outline'" color="neutral" size="sm"
                @click="formState.statusStr = item.value">
                {{ item.label }}
              </UButton>
            </div>
          </UFormField>

          <div class="flex justify-end gap-2 pt-4">
            <UButton color="neutral" variant="outline" @click="closeModal">取消</UButton>
            <UButton type="submit" :loading="submitting">确认提交</UButton>
          </div>
        </UForm>
      </template>
    </UModal>

    <!-- 删除确认弹窗 -->
    <UModal v-model:open="deleteModalVisible" title="确认删除">
      <template #body>
        <p class="text-sm text-slate-600">
          确认删除用户
          <span class="font-semibold text-slate-900">{{ deletingUser?.username }}</span>
          吗？此操作不可撤销。
        </p>
        <div class="flex justify-end gap-2 pt-6">
          <UButton color="neutral" variant="outline" @click="deleteModalVisible = false">取消</UButton>
          <UButton color="error" :loading="deleting" @click="doDelete">确认删除</UButton>
        </div>
      </template>
    </UModal>

    <!-- 重置密码确认弹窗 -->
    <UModal v-model:open="resetModalVisible" title="重置密码">
      <template #body>
        <p class="text-sm text-slate-600">
          确认重置用户
          <span class="font-semibold text-slate-900">{{ resetingUser?.username }}</span>
          的密码吗？
        </p>
        <div class="flex justify-end gap-2 pt-6">
          <UButton color="neutral" variant="outline" @click="resetModalVisible = false">取消</UButton>
          <UButton :loading="reseting" @click="doResetPassword">确认重置</UButton>
        </div>
      </template>
    </UModal>

    <!-- 头像放大弹窗 -->
    <UModal v-model:open="avatarModalVisible" title="头像预览">
      <template #body>
        <div class="flex justify-center p-4">
          <img :src="avatarUrl" class="w-48 h-48 rounded-full object-cover" />
        </div>
      </template>
    </UModal>

  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import * as z from 'zod'
import { useDebounceFn } from '@vueuse/core'
import type { FormSubmitEvent, TableColumn } from '@nuxt/ui'
// ---- 类型定义 ----
import type { User } from '~/types/user'

definePageMeta({ layout: 'admin' })

// ---- 工具函数 ----
const isEnabled = (user: User) => user.status === 1

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })

// ---- 基础状态 ----
const toast = useToast()
const list = ref<User[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const searchKeyword = ref('')

// ---- 弹窗状态 ----
const modalVisible = ref(false)
const submitting = ref(false)
const editingUser = ref<User | null>(null)

const deleteModalVisible = ref(false)
const deleting = ref(false)
const deletingUser = ref<User | null>(null)

const resetModalVisible = ref(false)
const reseting = ref(false)
const resetingUser = ref<User | null>(null)

const avatarModalVisible = ref(false)
const avatarUrl = ref('')

// ---- 列定义 ----
const columns: TableColumn<User>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'username', header: '账号' },
  { accessorKey: 'name', header: '名称' },
  { accessorKey: 'avatar', header: '头像' },
  { accessorKey: 'role', header: '角色' },
  { accessorKey: 'status', header: '状态' },
  {
    accessorKey: 'createdAt',
    header: '创建时间',
    cell: ({ row }) => h('span', { class: 'text-slate-500 text-sm' }, formatDate(row.original.createdAt)),
  },
  { id: 'actions', header: '操作', meta: { class: { td: 'w-1', th: 'w-1' } } },
]

// ---- 搜索防抖 ----
const handleSearch = useDebounceFn(() => {
  page.value = 1
  fetchList()
}, 300)

const UserApi = useUserApi()
const { request } = useApi()

// ---- 获取列表 ----
async function fetchList() {
  const res = await request(
    () => UserApi.list({ keyword: searchKeyword.value, page: page.value, pageSize: pageSize.value }),
    { errorMsg: '获取列表失败', loadingRef: loading }
  )
  if (res) {
    list.value = res.list
    total.value = res.total
  }
}

// ---- 表单 ----
// URadioGroup 需要字符串值，用 statusStr 中转
const statusOptions = [
  { label: '启用', value: '1' },
  { label: '禁用', value: '0' },
]

const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '普通用户', value: 'user' },
]

const formState = reactive({
  username: '',
  password: '',
  name: '',
  role: 'user',
  statusStr: '1', // RadioGroup 绑定字符串
})

const formSchema = z.object({
  username: z.string().min(1, '请输入账号'),
  password: z.string().refine(
    val => editingUser.value ? true : val.length >= 6,
    { message: '新用户密码至少 6 位' }
  ),
  name: z.string().optional(),
  statusStr: z.string(),
  role: z.string(),
})

type FormSchema = z.output<typeof formSchema>

function openModal(user?: User) {
  editingUser.value = user ?? null
  Object.assign(formState, user ? {
    username: user.username,
    password: '',
    name: user.name ?? '',
    statusStr: String(user.status ?? 1),
    role: user.role ?? 'user',
  } : {
    username: '',
    password: '',
    name: '',
    statusStr: '1',
    role: 'user',
  })
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
  editingUser.value = null
}

// ---- 提交表单 ----
async function onSubmit(event: FormSubmitEvent<FormSchema>) {
  const status = Number(event.data.statusStr)
  const res = await request(
    () => editingUser.value
      ? UserApi.update(editingUser.value.id, { name: event.data.name, status, role: event.data.role })
      : UserApi.create({ ...event.data, status }),
    { errorMsg: editingUser.value ? '更新失败' : '创建失败', loadingRef: submitting }
  )
  if (res !== null) {
    toast.add({ title: editingUser.value ? '更新成功' : '创建成功', color: 'success' })
    closeModal()
    fetchList()
  }
}

// ---- 状态切换 ----
async function toggleStatus(user: User) {
  const newStatus = isEnabled(user) ? 0 : 1
  const res = await request(
    () => UserApi.toggleStatus(user.id, newStatus),
    { errorMsg: '操作失败' }
  )
  if (res) {
    const target = list.value.find(u => u.id === user.id)
    if (target) target.status = newStatus
    toast.add({ title: `已${newStatus === 1 ? '启用' : '禁用'}`, color: 'success' })
  }
}

// ---- 删除 ----
function confirmDelete(user: User) {
  deletingUser.value = user
  deleteModalVisible.value = true
}

async function doDelete() {
  if (!deletingUser.value) return
  const res = await request(
    () => UserApi.remove(deletingUser.value!.id),
    { errorMsg: '删除失败', loadingRef: deleting }
  )
  if (res !== null) {
    toast.add({ title: '删除成功', color: 'success' })
    deleteModalVisible.value = false
    fetchList()
  }
}

// ---- 重置密码 ----
function confirmResetPassword(user: User) {
  resetingUser.value = user
  resetModalVisible.value = true
}

async function doResetPassword() {
  if (!resetingUser.value) return
  const res = await request(
    () => UserApi.resetPassword(resetingUser.value!.id),
    { errorMsg: '重置失败', loadingRef: reseting }
  )
  if (res !== null) {
    toast.add({ title: '密码已重置', color: 'success' })
    resetModalVisible.value = false
  }
}

// ---- 初始化 ----
onMounted(fetchList)
</script>
