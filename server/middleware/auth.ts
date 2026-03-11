// server/middleware/auth.ts
export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  // 放行登录接口和 nuxt 内部请求
  const publicPaths = [
    '/api/auth/login',
    '/api/auth/logout',
    '/api/_auth',
    '/api/_nuxt_icon',
  ]

  const isPublic = publicPaths.some(p => path.startsWith(p))

  if (path.startsWith('/api/') && !isPublic) {
    const session = await getUserSession(event)
    if (!session?.user) {
      throw createError({ statusCode: 401, message: '未登录' })
    }
  }
})