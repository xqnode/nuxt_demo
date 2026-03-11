import { mysqlTable, int, varchar, tinyint, timestamp } from 'drizzle-orm/mysql-core'

export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  avatar: varchar('avatar', { length: 255 }),
  status: tinyint('status'),
  role: varchar('role', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert