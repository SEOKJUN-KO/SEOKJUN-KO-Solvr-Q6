import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import env from '../config/env'
import * as schema from './schema'
import { Database as DrizzleDatabase } from '../types/database'

let db: DrizzleDatabase | null = null

export async function getDb(): Promise<DrizzleDatabase> {
  if (!db) {
    const sqlite = new Database(env.DATABASE_URL)
    db = drizzle(sqlite, { schema }) as DrizzleDatabase
    
    // 데이터베이스 마이그레이션
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS sleep_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        sleepStartTime TEXT NOT NULL,
        sleepEndTime TEXT NOT NULL,
        notes TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `)
  }
  return db
}

export async function initializeDatabase(): Promise<DrizzleDatabase> {
  return getDb()
}

export default { initializeDatabase, getDb }
