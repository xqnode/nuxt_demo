// server/api/users/[id].delete.ts
import { eq } from 'drizzle-orm'
import { users } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const db = await getDb()

  await db.delete(users).where(eq(users.id, id))

  return { code: 0, message: '删除成功' }
})