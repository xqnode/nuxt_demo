<!-- app/layouts/admin.vue -->
<template>
  <div class="h-screen flex overflow-hidden bg-slate-50">
    <!-- 左侧菜单 -->
    <aside class="flex flex-col bg-slate-800 border-r border-slate-700 transition-all duration-300 shrink-0"
      :class="collapsed ? 'w-16' : 'w-56'">
      <!-- Logo -->
      <div class="h-16 flex items-center justify-between px-4 border-b border-slate-700">
        <div class="flex items-center gap-2 overflow-hidden">
          <div
            class="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm shadow-blue-900">
            <Icon name="lucide:hexagon" size="16" />
          </div>
          <span class="text-sm font-semibold text-white whitespace-nowrap transition-all duration-300"
            :class="collapsed ? 'opacity-0 w-0' : 'opacity-100'">
            后台管理
          </span>
        </div>
      </div>

      <!-- 菜单项 -->
      <nav class="flex-1 py-4 px-2 space-y-1">
        <NuxtLink v-for="item in menus" :key="item.path" :to="item.path"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all" :class="[
            collapsed ? 'justify-center' : '',
            isActive(item.path)
              ? 'bg-blue-500 text-white'
              : 'text-slate-400 hover:bg-slate-700 hover:text-white'
          ]">
          <Icon :name="item.icon" size="18" class="shrink-0" />
          <span class="whitespace-nowrap transition-all duration-300 overflow-hidden"
            :class="collapsed ? 'opacity-0 w-0' : 'opacity-100'">
            {{ item.label }}
          </span>
        </NuxtLink>
      </nav>

      <!-- 折叠按钮 -->
      <div class="p-2 border-t border-slate-700">
        <button
          class="w-full flex items-center justify-center py-2 rounded-xl text-slate-400 hover:bg-slate-700 hover:text-white transition-all"
          @click="collapsed = !collapsed">
          <Icon :name="collapsed ? 'lucide:chevron-right' : 'lucide:chevron-left'" size="18" />
        </button>
      </div>
    </aside>

    <!-- 右侧内容 -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
        <div>
          <h1 class="text-sm font-semibold text-slate-700">{{ currentMenu?.label }}</h1>
          <p class="text-xs text-slate-400 mt-0.5">{{ currentMenu?.desc }}</p>
        </div>
        <div class="flex items-center gap-3">
          <!-- 消息 -->
          <button
            class="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all">
            <Icon name="lucide:bell" size="18" />
          </button>
          <!-- 头像 -->
          <div class="flex items-center gap-2 cursor-pointer group" @click="handleLogout">
            <div class="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-blue-100 flex items-center justify-center">
              <img v-if="user?.avatar" :src="user.avatar" class="w-full h-full object-cover" />
              <Icon v-else name="lucide:user" size="16" class="text-blue-400" />
            </div>
            <span class="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
              {{ user?.name || user?.username }}
            </span>
            <Icon name="lucide:log-out" size="14" class="text-slate-300 group-hover:text-red-400 transition-colors" />
          </div>
        </div>
      </header>

      <!-- Main -->
      <main class="flex-1 overflow-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { user, clear } = useUserSession()
const collapsed = ref(false)

const menus = [
  {
    label: '仪表盘',
    path: '/admin',
    icon: 'lucide:layout-dashboard',
    desc: '数据概览',
  },
  {
    label: '用户管理',
    path: '/admin/users',
    icon: 'lucide:users',
    desc: '管理系统用户',
  },
]

const isActive = (path: string) => route.path === path

const currentMenu = computed(() => menus.find(m => isActive(m.path)))

async function handleLogout() {
  await clear()
  await navigateTo('/login', { replace: true })
}
</script>