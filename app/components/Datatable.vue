<!-- app/components/DataTable.vue -->
<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef } from '@tanstack/vue-table'
import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next'

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading?: boolean
  // 服务端分页
  total: number
  page: number
  pageSize: number
}>()

const emit = defineEmits<{
  'update:page': [page: number]
  'update:pageSize': [size: number]
}>()

const table = useVueTable({
  get data() { return props.data },
  get columns() { return props.columns },
  getCoreRowModel: getCoreRowModel(),
  // 使用服务端分页，手动控制
  manualPagination: true,
  get rowCount() { return props.total },
  state: {
    get pagination() {
      return { pageIndex: props.page - 1, pageSize: props.pageSize }
    },
  },
  onPaginationChange: (updater) => {
    const newPagination = typeof updater === 'function'
      ? updater({ pageIndex: props.page - 1, pageSize: props.pageSize })
      : updater
    emit('update:page', newPagination.pageIndex + 1)
    emit('update:pageSize', newPagination.pageSize)
  },
})

const totalPages = computed(() => Math.ceil(props.total / props.pageSize))
const startRow = computed(() => props.total === 0 ? 0 : (props.page - 1) * props.pageSize + 1)
const endRow = computed(() => Math.min(props.page * props.pageSize, props.total))
</script>

<template>
  <div class="space-y-3">
    <!-- 表格 -->
    <div class="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
            class="bg-[#fafafa] dark:bg-muted hover:bg-[#fafafa] dark:hover:bg-muted border-b border-border"
          >
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              class="text-xs font-semibold text-foreground px-4 py-3"
            >
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <!-- 加载中 -->
          <TableRow v-if="loading">
            <TableCell :colspan="columns.length" class="text-center py-16 text-muted-foreground">
              <div class="flex flex-col items-center gap-2">
                <span class="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
                <span class="text-xs">加载中...</span>
              </div>
            </TableCell>
          </TableRow>
          <!-- 暂无数据 -->
          <TableRow v-else-if="!table.getRowModel().rows.length">
            <TableCell :colspan="columns.length" class="text-center py-16 text-muted-foreground">
              <div class="flex flex-col items-center gap-3">
                <Icon name="lucide:inbox" size="36" class="text-muted-foreground/40" />
                <span class="text-sm">暂无数据</span>
              </div>
            </TableCell>
          </TableRow>
          <!-- 数据行 -->
          <TableRow
            v-for="(row, index) in table.getRowModel().rows"
            v-else
            :key="row.id"
            class="border-b border-border last:border-0 transition-colors hover:bg-primary/5 cursor-default"
            :class="index % 2 === 1 ? 'bg-[#fafafa] dark:bg-muted/30' : 'bg-white dark:bg-transparent'"
          >
            <TableCell
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="px-4 py-3"
            >
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- 分页 -->
    <div class="flex items-center justify-between px-1">
      <p class="text-xs text-muted-foreground">
        共 <span class="font-medium text-foreground">{{ total }}</span> 条，
        显示第 {{ startRow }}–{{ endRow }} 条
      </p>
      <div class="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          class="h-7 w-7"
          :disabled="page <= 1"
          @click="emit('update:page', 1)"
        >
          <ChevronsLeft class="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          class="h-7 w-7"
          :disabled="page <= 1"
          @click="emit('update:page', page - 1)"
        >
          <ChevronLeft class="h-3.5 w-3.5" />
        </Button>
        <span class="text-xs text-muted-foreground px-2">
          第 <span class="font-medium text-foreground">{{ page }}</span> / {{ totalPages }} 页
        </span>
        <Button
          variant="outline"
          size="icon"
          class="h-7 w-7"
          :disabled="page >= totalPages"
          @click="emit('update:page', page + 1)"
        >
          <ChevronRight class="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          class="h-7 w-7"
          :disabled="page >= totalPages"
          @click="emit('update:page', totalPages)"
        >
          <ChevronsRight class="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  </div>
</template>