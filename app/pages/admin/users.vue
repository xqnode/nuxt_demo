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

    <!-- 表格 -->
    <div class="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-48">账号</TableHead>
            <TableHead class="w-40">名称</TableHead>
            <TableHead class="w-28">状态</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead class="text-right w-28">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="loading">
            <TableCell colspan="5" class="text-center py-16 text-muted-foreground">
              <div class="flex flex-col items-center gap-2">
                <span class="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
                <span class="text-xs">加载中...</span>
              </div>
            </TableCell>
          </TableRow>
          <TableRow v-else-if="!list.length">
            <TableCell colspan="5" class="text-center py-16 text-muted-foreground">
              <div class="flex flex-col items-center gap-2">
                <Icon name="lucide:users" size="32" />
                <span class="text-xs">暂无数据</span>
              </div>
            </TableCell>
          </TableRow>
          <TableRow v-for="row in list" v-else :key="row.id">
            <TableCell>
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                  <img v-if="row.avatar" :src="row.avatar" class="w-full h-full object-cover" />
                  <Icon v-else name="lucide:user" size="14" class="text-muted-foreground" />
                </div>
                <span class="font-medium">{{ row.username }}</span>
              </div>
            </TableCell>
            <TableCell class="text-muted-foreground">{{ row.name || '—' }}</TableCell>
            <TableCell>
              <Badge :variant="row.status === 1 ? 'default' : 'secondary'" class="cursor-pointer"
                @click="toggleStatus(row)">
                <span class="w-1.5 h-1.5 rounded-full mr-1.5"
                  :class="row.status === 1 ? 'bg-white' : 'bg-muted-foreground'" />
                {{ row.status === 1 ? '启用' : '禁用' }}
              </Badge>
            </TableCell>
            <TableCell class="text-muted-foreground text-xs">{{ formatDate(row.createdAt) }}</TableCell>
            <TableCell class="text-right">
              <div class="flex items-center justify-end gap-1">
                <Button variant="ghost" size="icon" @click="openModal(row)">
                  <Icon name="lucide:pencil" size="14" />
                </Button>
                <Button variant="ghost" size="icon" class="text-muted-foreground hover:text-destructive"
                  @click="confirmDelete(row)">
                  <Icon name="lucide:trash-2" size="14" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- 新增/编辑弹窗 -->
    <Dialog v-model:open="modalVisible">
      <DialogContent class="max-w-lg">
        <DialogHeader>
          <DialogTitle>{{ modalTitle }}</DialogTitle>
        </DialogHeader>

        <div class="grid gap-5 py-4">
          <div class="grid grid-cols-6 items-center gap-4">
            <Label for="username" class="text-right">账号 <span class="text-destructive">*</span></Label>
            <div class="col-span-5 relative">
              <Input id="username" v-model="form.username" placeholder="请输入账号" :disabled="!!editingUser"
                :class="formErrors.username ? 'border-destructive' : ''" />
              <span v-if="formErrors.username" class="text-[10px] text-destructive absolute -bottom-4 left-0">{{
                formErrors.username }}</span>
            </div>
          </div>

          <div class="grid grid-cols-6 items-center gap-4">
            <Label for="password" class="text-right">
              密码 <span v-if="!editingUser" class="text-destructive">*</span>
            </Label>
            <div class="col-span-5 relative">
              <Input id="password" v-model="form.password" type="password" placeholder="请输入密码（不填则不修改）"
                :class="formErrors.password ? 'border-destructive' : ''" />
              <span v-if="formErrors.password" class="text-[10px] text-destructive absolute -bottom-4 left-0">{{
                formErrors.password }}</span>
            </div>
          </div>

          <div class="grid grid-cols-6 items-center gap-4">
            <Label for="name" class="text-right">名称</Label>
            <Input id="name" v-model="form.name" placeholder="请输入名称" class="col-span-5" />
          </div>

          <div class="grid grid-cols-6 items-center gap-4">
            <Label class="text-right">状态</Label>
            <div class="col-span-5">
              <RadioGroup v-model="formStatus" class="flex gap-6">
                <div v-for="opt in statusOptions" :key="opt.value" class="flex items-center gap-2">
                  <RadioGroupItem :id="`status-${opt.value}`" :value="String(opt.value)" />
                  <Label :for="`status-${opt.value}`" class="font-normal cursor-pointer text-sm">{{ opt.label }}</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="closeModal">取消</Button>
          <Button :disabled="submitting" @click="handleSubmit">
            <span v-if="submitting"
              class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
            确认
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
            <span v-if="deleting"
              class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
            确认删除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

definePageMeta({ layout: 'admin' })

interface User {
  id: number
  username: string
  name: string | null
  avatar: string | null
  status: number | null
  createdAt: string | null
}

const list = ref<User[]>([])
const loading = ref(false)
const searchKeyword = ref('')
let searchTimer: ReturnType<typeof setTimeout>

async function fetchList() {
  loading.value = true
  try {
    list.value = await $fetch('/api/users', {
      query: { keyword: searchKeyword.value },
    })
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(fetchList, 300)
}

function formatDate(val: string | null) {
  if (!val) return '—'
  return new Date(val).toLocaleDateString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  })
}

async function toggleStatus(row: User) {
  const newStatus = row.status === 1 ? 0 : 1
  await $fetch(`/api/users/${row.id}/status`, {
    method: 'PATCH',
    body: { status: newStatus },
  })
  row.status = newStatus
}

const modalVisible = ref(false)
const submitting = ref(false)
const editingUser = ref<User | null>(null)
const statusOptions = [{ label: '启用', value: 1 }, { label: '禁用', value: 0 }]
const form = reactive({ username: '', password: '', name: '', status: 1 })
const formErrors = reactive({ username: '', password: '' })
const modalTitle = computed(() => editingUser.value ? '编辑用户' : '新增用户')

// RadioGroup 只支持 string，单独用一个 computed 转换
const formStatus = computed({
  get: () => String(form.status),
  set: (val) => { form.status = Number(val) },
})

function openModal(user?: User) {
  editingUser.value = user || null
  formErrors.username = ''
  formErrors.password = ''
  if (user) {
    form.username = user.username
    form.password = ''
    form.name = user.name || ''
    form.status = user.status ?? 1
  } else {
    form.username = ''
    form.password = ''
    form.name = ''
    form.status = 1
  }
  modalVisible.value = true
}

function closeModal() { modalVisible.value = false }

function validateForm() {
  formErrors.username = form.username.trim() ? '' : '请输入账号'
  formErrors.password = (!editingUser.value && !form.password) ? '请输入密码' : ''
  return !formErrors.username && !formErrors.password
}

async function handleSubmit() {
  if (!validateForm()) return
  submitting.value = true
  try {
    if (editingUser.value) {
      await $fetch(`/api/users/${editingUser.value.id}`, {
        method: 'PUT',
        body: { password: form.password || undefined, name: form.name, status: form.status },
      })
    } else {
      await $fetch('/api/users', {
        method: 'POST',
        body: { username: form.username, password: form.password, name: form.name, status: form.status },
      })
    }
    closeModal()
    fetchList()
  } catch (e: any) {
    formErrors.username = e?.data?.message || '操作失败'
  } finally {
    submitting.value = false
  }
}

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