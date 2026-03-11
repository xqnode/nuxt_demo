<!-- app/layouts/admin.vue -->
<template>
  <UApp>
    <div class="h-screen flex overflow-hidden bg-[#f5f6fa]">

      <!-- 侧边栏 -->
      <aside class="flex flex-col bg-[#1a1d2e] border-r border-white/5 transition-all duration-300 shrink-0 shadow-xl"
        :class="collapsed ? 'w-16' : 'w-56'">

        <!-- Logo -->
        <div class="h-16 flex items-center px-4 border-b border-white/5 shrink-0">
          <div class="flex items-center gap-3 overflow-hidden min-w-0">
            <div
              class="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-900/40">
              <UIcon name="i-lucide-hexagon" class="text-white size-4" />
            </div>
            <Transition name="fade">
              <span v-if="!collapsed" class="text-sm font-semibold text-white whitespace-nowrap tracking-wide">
                后台管理
              </span>
            </Transition>
          </div>
        </div>

        <!-- 导航菜单 -->
        <nav class="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          <template v-for="item in menus" :key="item.path">
            <UTooltip :text="item.label" :disabled="!collapsed" :content="{ side: 'right' }" :delay-duration="0">
              <NuxtLink :to="item.path"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group" :class="[
                  collapsed ? 'justify-center' : '',
                  isActive(item.path)
                    ? 'bg-indigo-500/20 text-indigo-300'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                ]">
                <!-- 激活指示条 -->
                <span v-if="isActive(item.path)" class="absolute left-0 w-0.5 h-6 bg-indigo-400 rounded-r-full" />
                <UIcon :name="item.icon" class="shrink-0 size-[18px]" />
                <Transition name="fade">
                  <span v-if="!collapsed" class="whitespace-nowrap truncate">
                    {{ item.label }}
                  </span>
                </Transition>
              </NuxtLink>
            </UTooltip>
          </template>
        </nav>

        <!-- 折叠按钮 -->
        <div class="p-2 border-t border-white/5 shrink-0">
          <UTooltip :text="collapsed ? '展开菜单' : '收起菜单'" :content="{ side: 'right' }" :delay-duration="0">
            <button
              class="w-full flex items-center justify-center py-2 rounded-xl text-slate-500 hover:bg-white/5 hover:text-slate-300 transition-all duration-200"
              @click="collapsed = !collapsed">
              <UIcon :name="collapsed ? 'i-lucide-chevron-right' : 'i-lucide-chevron-left'" class="size-[18px]" />
            </button>
          </UTooltip>
        </div>
      </aside>

      <!-- 右侧内容区 -->
      <div class="flex-1 flex flex-col overflow-hidden min-w-0">

        <!-- Header -->
        <header
          class="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0 shadow-sm">
          <div class="min-w-0">
            <h1 class="text-sm font-semibold text-slate-800 truncate">
              {{ currentMenu?.label ?? '管理后台' }}
            </h1>
            <p class="text-xs text-slate-400 mt-0.5 truncate">
              {{ currentMenu?.desc ?? '' }}
            </p>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <!-- 通知铃铛 -->
            <UTooltip text="通知" :delay-duration="0">
              <UButton icon="i-lucide-bell" color="neutral" variant="ghost" size="sm"
                class="text-slate-400 hover:text-slate-600" />
            </UTooltip>

            <!-- 用户下拉菜单 -->
            <UDropdownMenu :items="userMenuItems" :content="{ align: 'end', sideOffset: 8 }" :ui="{
              // content 必须设置 bg-white 或类似的背景，否则会透明导致重叠
              content: 'min-w-32 bg-white p-1 shadow-xl rounded-lg border border-slate-100',
              // item 必须设置 flex 和 gap，否则图标和文字会挤在一起
              item: 'group flex items-center gap-2 px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer outline-none'
            }">
              <UButton color="neutral" variant="ghost" class="flex items-center gap-2 px-2">
                <UAvatar :src="user?.avatar" :alt="user?.name || user?.username"
                  class="size-7 ring-2 ring-indigo-100" />
                <span class="text-sm text-slate-600 max-w-[100px] truncate">
                  {{ user?.name || user?.username || '管理员' }}
                </span>
                <UIcon name="i-lucide-chevron-down" class="size-3.5 text-slate-400" />
              </UButton>
            </UDropdownMenu>
          </div>
        </header>

        <!-- 主内容 -->
        <main class="flex-1 overflow-auto p-6">
          <slot />
        </main>
      </div>
    </div>

    <!-- 退出确认弹窗 -->
    <UModal v-model:open="showLogoutModal">
      <template #content>
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <UIcon name="i-lucide-log-out" class="size-5 text-red-500" />
            </div>
            <div>
              <h3 class="text-sm font-semibold text-slate-800">确认退出</h3>
              <p class="text-xs text-slate-400 mt-0.5">退出后需要重新登录</p>
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="outline" size="sm" @click="showLogoutModal = false">取消</UButton>
            <UButton color="error" size="sm" :loading="loggingOut" @click="confirmLogout">确认退出</UButton>
          </div>
        </div>
      </template>
    </UModal>
  </UApp>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const route = useRoute()
const { user, clear } = useUserSession()

const collapsed = ref(false)
const showLogoutModal = ref(false)
const loggingOut = ref(false)

const menus = [
  {
    label: '系统首页',
    path: '/admin',
    icon: 'i-lucide-layout-dashboard',
    desc: '数据概览',
  },
  {
    label: '用户管理',
    path: '/admin/users',
    icon: 'i-lucide-users',
    desc: '管理系统用户',
  },
  {
    label: '商品管理',

    icon: 'i-lucide-package',
    desc: '管理源码商品',
  },
  {
    label: '订单管理',

    icon: 'i-lucide-shopping-cart',
    desc: '查看和处理订单',
  },
  {
    label: '系统设置',

    icon: 'i-lucide-settings',
    desc: '系统配置',
  },
]

const userMenuItems: DropdownMenuItem[][] = [
  [
    {
      label: '个人设置',
      icon: 'i-lucide-user',
      to: '/admin/settings',
    },
  ],
  [
    {
      label: '退出登录',
      icon: 'i-lucide-log-out',
      color: 'error' as const,
      onSelect: () => { showLogoutModal.value = true },
    }
  ]
]

const isActive = (path: string) => route.path === path
const currentMenu = computed(() => menus.find(m => isActive(m.path)))

async function confirmLogout() {
  loggingOut.value = true
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await clear()
    await navigateTo('/login', { replace: true })
  } finally {
    loggingOut.value = false
    showLogoutModal.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, width 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  width: 0;
}
</style>