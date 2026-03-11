<!-- app/pages/admin/users.vue -->
<template>
  <div>
    <!-- 顶部操作栏 -->
    <div class="flex items-center justify-between mb-4">
      <div class="relative">
        <Icon name="lucide:search" size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input v-model="searchKeyword" placeholder="搜索账号 / 名称" class="pl-9 w-60" @input="handleSearch" />
      </div>
      <Button @click="openModal()">
        <Icon name="lucide:plus" size="16" />
        新增用户
      </Button>
    </div>

    <!-- DataTable -->
    <DataTable
      :columns="columns"
      :data="list"
      :loading="loading"
      :total="total"
      :page="page"
      :page-size="pageSize"
      @update:page="val => { page = val; fetchList() }"
      @update:page-size="val => { pageSize = val; page = 1; fetchList() }"
    />

    <!-- 新增/编辑弹窗 -->
    <Dialog v-model:open="modalVisible">
      <DialogContent class="max-w-lg">
        <DialogHeader>
          <DialogTitle>{{ modalTitle }}</DialogTitle>
        </DialogHeader>
        <form class="py-4 space-y-3" @submit="onSubmit">
          <AppFormItem name="username" label="账号 *" placeholder="请输入账号" :disabled="!!editingUser" />
          <AppFormItem v-if="!editingUser" name="password" label="密码 *" type="password" placeholder="请输入密码" />
          <AppFormItem name="name" label="名称" placeholder="请输入名称" />
          <AppFormItem name="status" label="状态">
            <template #default="{ field }">
              <RadioGroup
                :model-value="String(field.modelValue ?? 1)"
                class="flex gap-4"
                @update:model-value="val => field['onUpdate:modelValue']?.(Number(val))"
              >
                <div v-for="opt in statusOptions" :key="opt.value" class="flex items-center gap-1.5">
                  <RadioGroupItem :id="`status-${opt.value}`" :value="String(opt.value)" />
                  <Label :for="`status-${opt.value}`" class="text-sm font-normal cursor-pointer">{{ opt.label }}</Label>
                </div>
              </RadioGroup>
            </template>
          </AppFormItem>
          <DialogFooter class="mt-5">
            <Button type="button" variant="outline" size="sm" @click="closeModal">取消</Button>
            <Button type="submit" size="sm" :disabled="submitting">
              <span v-if="submitting" class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
              确认
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <!-- 重置密码弹窗 -->
    <Dialog v-model:open="resetPasswordVisible">
      <DialogContent class="max-w-sm">
        <DialogHeader>
          <div class="flex flex-col items-center text-center gap-3 pt-2">
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="lucide:key-round" size="22" class="text-primary" />
            </div>
            <div>
              <DialogTitle>重置密码</DialogTitle>
              <p class="text-sm text-muted-foreground mt-1">
                请输入用户
                <span class="text-foreground font-medium">{{ resetPasswordUser?.username }}</span>
                的新密码
              </p>
            </div>
          </div>
        </DialogHeader>
        <div class="px-1 pb-2">
          <Input v-model="newPassword" type="password" placeholder="请输入新密码" class="h-8 text-sm" />
          <p v-if="resetPasswordError" class="text-[10px] text-destructive mt-1">{{ resetPasswordError }}</p>
        </div>
        <DialogFooter class="gap-2 sm:gap-2">
          <Button variant="outline" class="flex-1" @click="resetPasswordVisible = false">取消</Button>
          <Button class="flex-1" :disabled="resettingPassword" @click="handleResetPassword">
            <span v-if="resettingPassword" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
            确认重置
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- 删除确认弹窗 -->
    <Dialog v-model:open="deleteVisible">
      <DialogContent class="max-w-sm">
        <DialogHeader>
          <div class="flex flex-col items-center text-center gap-3 pt-2">
            <div class="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
              <Icon name="lucide:trash-2" size="22" class="text-destructive" />
            </div>
            <div>
              <DialogTitle>确认删除</DialogTitle>
              <p class="text-sm text-muted-foreground mt-1">
                确定要删除用户
                <span class="text-foreground font-medium">{{ deletingUser?.username }}</span>
                吗？此操作不可恢复。
              </p>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter class="gap-2 sm:gap-2">
          <Button variant="outline" class="flex-1" @click="deleteVisible = false">取消</Button>
          <Button variant="destructive" class="flex-1" :disabled="deleting" @click="handleDelete">
            <span v-if="deleting" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
            确认删除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createColumns, type User } from './users/columns'

definePageMeta({ layout: 'admin' })

// ---- 列表 & 分页 ----
const list = ref<User[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const searchKeyword = ref('')
let searchTimer: ReturnType<typeof setTimeout>

async function fetchList() {
  loading.value = true
  try {
    const res = await $fetch<{ list: User[]; total: number }>('/api/users', {
      query: {
        keyword: searchKeyword.value,
        page: page.value,
        pageSize: pageSize.value,
      },
    })
    list.value = res.list
    total.value = res.total
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  clearTimeout(searchTimer)
  page.value = 1
  searchTimer = setTimeout(fetchList, 300)
}

async function toggleStatus(user: User) {
  const newStatus = user.status === 1 ? 0 : 1
  await $fetch(`/api/users/${user.id}/status`, {
    method: 'PATCH',
    body: { status: newStatus },
  })
  user.status = newStatus
}

// ---- columns ----
const columns = createColumns({
  onEdit: openModal,
  onResetPassword: confirmResetPassword,
  onDelete: confirmDelete,
  onToggleStatus: toggleStatus,
})

// ---- 新增/编辑弹窗 ----
const modalVisible = ref(false)
const submitting = ref(false)
const editingUser = ref<User | null>(null)
const statusOptions = [{ label: '启用', value: 1 }, { label: '禁用', value: 0 }]
const modalTitle = computed(() => editingUser.value ? '编辑用户' : '新增用户')

const formSchema = computed(() =>
  toTypedSchema(
    z.object({
      username: z.string().min(1, '请输入账号'),
      password: editingUser.value
        ? z.string().optional()
        : z.string().min(6, '密码至少6位'),
      name: z.string().optional(),
      status: z.number(),
    })
  )
)

const { handleSubmit, resetForm, setFieldError } = useForm({
  validationSchema: formSchema,
  initialValues: { username: '', password: '', name: '', status: 1 },
})

function openModal(user?: User) {
  editingUser.value = user || null
  resetForm({
    values: {
      username: user?.username ?? '',
      password: '',
      name: user?.name ?? '',
      status: user?.status ?? 1,
    },
  })
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
}

const onSubmit = handleSubmit(async (values) => {
  submitting.value = true
  try {
    if (editingUser.value) {
      await $fetch(`/api/users/${editingUser.value.id}`, {
        method: 'PUT',
        body: { name: values.name, status: values.status },
      })
    } else {
      await $fetch('/api/users', {
        method: 'POST',
        body: { username: values.username, password: values.password, name: values.name, status: values.status },
      })
    }
    closeModal()
    fetchList()
  } catch (e: any) {
    setFieldError('username', e?.data?.message || '操作失败')
  } finally {
    submitting.value = false
  }
})

// ---- 重置密码弹窗 ----
const resetPasswordVisible = ref(false)
const resetPasswordUser = ref<User | null>(null)
const newPassword = ref('')
const resetPasswordError = ref('')
const resettingPassword = ref(false)

function confirmResetPassword(user: User) {
  resetPasswordUser.value = user
  newPassword.value = ''
  resetPasswordError.value = ''
  resetPasswordVisible.value = true
}

async function handleResetPassword() {
  if (!newPassword.value.trim()) {
    resetPasswordError.value = '请输入新密码'
    return
  }
  resettingPassword.value = true
  try {
    await $fetch(`/api/users/${resetPasswordUser.value!.id}/password`, {
      method: 'PATCH',
      body: { password: newPassword.value },
    })
    resetPasswordVisible.value = false
  } catch (e: any) {
    resetPasswordError.value = e?.data?.message || '操作失败'
  } finally {
    resettingPassword.value = false
  }
}

// ---- 删除弹窗 ----
const deleteVisible = ref(false)
const deletingUser = ref<User | null>(null)
const deleting = ref(false)

function confirmDelete(user: User) {
  deletingUser.value = user
  deleteVisible.value = true
}

async function handleDelete() {
  if (!deletingUser.value) return
  deleting.value = true
  try {
    await $fetch(`/api/users/${deletingUser.value.id}`, { method: 'DELETE' })
    deleteVisible.value = false
    fetchList()
  } finally {
    deleting.value = false
  }
}

onMounted(fetchList)
</script>