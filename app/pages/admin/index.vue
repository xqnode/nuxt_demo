<!-- app/pages/admin/index.vue -->
<template>
  <div>
    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div v-for="card in stats" :key="card.label"
        class="bg-white rounded-2xl p-5 border border-slate-100 flex items-center gap-4">
        <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" :class="card.bg">
          <Icon :name="card.icon" size="20" :class="card.color" />
        </div>
        <div>
          <p class="text-xs text-slate-400 mb-1">{{ card.label }}</p>
          <p class="text-xl font-semibold text-slate-700">{{ card.value }}</p>
        </div>
      </div>
    </div>

    <!-- 欢迎区域 -->
    <div class="bg-white rounded-2xl p-6 border border-slate-100">
      <div class="flex items-center gap-3 mb-1">
        <Icon name="lucide:sun" size="18" class="text-amber-400" />
        <h2 class="text-sm font-semibold text-slate-700">
          你好，{{ user?.name || user?.username }} 👋
        </h2>
      </div>
      <p class="text-xs text-slate-400 ml-7">欢迎使用后台管理系统，今天也要加油哦。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { user } = useUserSession()

const stats = [
  { label: '总用户数', value: '128', icon: 'lucide:users', bg: 'bg-blue-50', color: 'text-blue-400' },
  { label: '今日新增', value: '12', icon: 'lucide:user-plus', bg: 'bg-emerald-50', color: 'text-emerald-400' },
  { label: '活跃用户', value: '86', icon: 'lucide:activity', bg: 'bg-amber-50', color: 'text-amber-400' },
  { label: '禁用账号', value: '3', icon: 'lucide:user-x', bg: 'bg-red-50', color: 'text-red-400' },
]
</script>