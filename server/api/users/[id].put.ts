// server/api/users/[id].put.ts
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { users } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const { password, name, role, status } = await readBody(event)

  const db = await getDb()

  const updateData: Record<string, any> = {
    name: name || null,
    role,
    status,
    updatedAt: new Date(),
  }

  if (password) {
    updateData.password = await bcrypt.hash(password, 10)
  }

  await db.update(users).set(updateData).where(eq(users.id, id))

  return { code: 0, message: '更新成功' }
})