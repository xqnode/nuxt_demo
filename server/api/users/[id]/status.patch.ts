// server/api/users/[id]/status.patch.ts
import { eq } from 'drizzle-orm'
import { users } from '../../../db/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const { status } = await readBody(event)

  const db = await getDb()

  await db.update(users).set({ status, updatedAt: new Date() }).where(eq(users.id, id))

  return { code: 0, message: '更新成功' }
})