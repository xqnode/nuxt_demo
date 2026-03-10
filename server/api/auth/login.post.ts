// server/api/auth/login.post.ts
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { users } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event)

  // 参数校验
  if (!username || !password) {
    throw createError({ statusCode: 400, message: '账号和密码不能为空' })
  }

  const db = await getDb()

  // 查询用户
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  })

  if (!user) {
    throw createError({ statusCode: 401, message: '账号或密码错误' })
  }

  // 检查状态
  if (user.status === 0) {
    throw createError({ statusCode: 403, message: '账号已被禁用' })
  }

  // 验证密码
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    throw createError({ statusCode: 401, message: '账号或密码错误' })
  }

  // 写入 session
  await setUserSession(event, {
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      avatar: user.avatar,
    },
  })

  return { code: 0, message: '登录成功' }
})