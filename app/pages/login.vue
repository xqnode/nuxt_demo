<!-- app/pages/login.vue -->
<template>
  <div
    class="fixed inset-0 overflow-hidden bg-gradient-to-br from-blue-50 via-sky-50 to-amber-50 flex items-center justify-center p-4">
    <!-- 背景装饰 -->
    <div
      class="absolute top-0 left-0 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
    <div
      class="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200/25 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
    <div class="absolute top-1/2 right-1/4 w-48 h-48 bg-sky-200/20 rounded-full blur-2xl" />

    <!-- 登录卡片 -->
    <div
      class="relative w-full max-w-md bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl shadow-blue-100 border border-white/80 p-8">
      <!-- Logo -->
      <div class="flex flex-col items-center mb-8">
        <div
          class="w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center text-white mb-3 shadow-md shadow-blue-200">
          <Icon name="lucide:hexagon" size="24" />
        </div>
        <h2 class="text-2xl font-semibold text-slate-700">欢迎回来</h2>
        <p class="text-sm text-slate-400 mt-1">请登录您的账号</p>
      </div>

      <!-- 账号 -->
      <div class="mb-4">
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
            <Icon name="lucide:user" size="16" />
          </span>
          <input v-model="form.username" type="text" placeholder="请输入账号" autocomplete="username"
            class="w-full bg-slate-50 border rounded-xl pl-9 pr-4 py-2.5 text-slate-700 text-sm placeholder-slate-300 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-400/20"
            :class="errors.username ? 'border-red-300' : 'border-slate-200'" @keyup.enter="handleLogin" />
        </div>
        <span v-if="errors.username" class="block mt-1 text-xs text-red-400">{{ errors.username }}</span>
      </div>

      <!-- 密码 -->
      <div class="mb-6">
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
            <Icon name="lucide:lock" size="16" />
          </span>
          <input v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="请输入密码"
            autocomplete="current-password"
            class="w-full bg-slate-50 border rounded-xl pl-9 pr-10 py-2.5 text-slate-700 text-sm placeholder-slate-300 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-400/20"
            :class="errors.password ? 'border-red-300' : 'border-slate-200'" @keyup.enter="handleLogin" />
          <button type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
            @click="showPassword = !showPassword">
            <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" size="16" />
          </button>
        </div>
        <span v-if="errors.password" class="block mt-1 text-xs text-red-400">{{ errors.password }}</span>
      </div>

      <!-- 服务端错误 -->
      <div v-if="serverError"
        class="mb-4 px-4 py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-400 text-xs flex items-center gap-2">
        <Icon name="lucide:circle-alert" size="14" />
        {{ serverError }}
      </div>

      <!-- 登录按钮 -->
      <button :disabled="loading"
        class="w-full py-2.5 rounded-xl bg-blue-400 text-white text-sm font-medium tracking-wide transition-all hover:bg-blue-500 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-blue-200"
        @click="handleLogin">
        <Icon v-if="!loading" name="lucide:log-in" size="16" />
        <span v-if="!loading">登 录</span>
        <span v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ auth: false })

const form = reactive({ username: '', password: '' })
const errors = reactive({ username: '', password: '' })
const serverError = ref('')
const loading = ref(false)
const showPassword = ref(false)

function validate() {
  errors.username = form.username.trim() ? '' : '请输入账号'
  errors.password = form.password ? '' : '请输入密码'
  return !errors.username && !errors.password
}

async function handleLogin() {
  if (!validate()) return
  loading.value = true
  serverError.value = ''
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { username: form.username, password: form.password },
    })
    await navigateTo('/', { replace: true })
  } catch (e: any) {
    serverError.value = e?.data?.message || '登录失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>