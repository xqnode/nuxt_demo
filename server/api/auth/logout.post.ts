// server/api/auth/logout.post.ts
export default defineEventHandler(async (event) => {
  await clearUserSession(event)
  return { code: 0, message: '已退出' }
})