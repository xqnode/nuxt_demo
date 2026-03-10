// server/api/users/index.post.ts
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { users } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const { username, password, name, status } = await readBody(event)

  if (!username || !password) {
    throw createError({ statusCode: 400, message: '账号和密码不能为空' })
  }

  const db = await getDb()

  const existing = await db.query.users.findFirst({
    where: eq(users.username, username),
  })

  if (existing) {
    throw createError({ statusCode: 400, message: '账号已存在' })
  }

  const hashed = await bcrypt.hash(password, 10)

  await db.insert(users).values({
    username,
    password: hashed,
    name: name || null,
    status: status ?? 1,
  })

  return { code: 0, message: '创建成功' }
})