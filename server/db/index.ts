// server/db/index.ts
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from './schema'

let _db: MySql2Database<typeof schema> | null = null

async function getDb() {
  if (_db) return _db
  const config = useRuntimeConfig()
  const connection = await mysql.createConnection({
    host: config.dbHost,
    port: Number(config.dbPort) || 3306,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
  })
  _db = drizzle(connection, { schema, mode: 'default' })
  return _db
}

export { getDb }