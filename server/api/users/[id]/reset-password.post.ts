// server/api/users/[id]/reset-password.post.ts
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { users } from '../../../db/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const db = await getDb()

  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  })

  if (!user) {
    throw createError({ statusCode: 404, message: '用户不存在' })
  }

  const defaultPassword = user.role === 'admin' ? 'admin' : '123456'
  const hashed = await bcrypt.hash(defaultPassword, 10)

  await db.update(users).set({ password: hashed, updatedAt: new Date() }).where(eq(users.id, id))

  return { code: 0, message: `密码已重置为 ${defaultPassword}` }
})