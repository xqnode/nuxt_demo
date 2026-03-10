// server/api/users/index.get.ts
import { like, or, eq } from 'drizzle-orm'
import { users } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const { keyword } = getQuery(event)
  const db = await getDb()

  const list = await db.query.users.findMany({
    where: keyword
      ? or(
        like(users.username, `%${keyword}%`),
        like(users.name, `%${keyword}%`),
      )
      : undefined,
    columns: { password: false },
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })

  return list
})