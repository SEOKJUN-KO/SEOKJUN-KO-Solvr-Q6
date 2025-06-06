import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { mkdir } from 'fs/promises'
import { dirname } from 'path'
import env from '../config/env'
import { users, sleepRecords } from './schema'
import { UserRole } from '../types'

// 데이터베이스 디렉토리 생성 함수
async function ensureDatabaseDirectory() {
  const dir = dirname(env.DATABASE_URL)
  try {
    await mkdir(dir, { recursive: true })
  } catch (error) {
    // 디렉토리가 이미 존재하는 경우 무시
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error
    }
  }
}

// 초기 사용자 데이터
const initialUsers = [
  {
    name: '관리자',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: '일반 사용자',
    email: 'user@example.com',
    role: UserRole.USER,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: '게스트',
    email: 'guest@example.com',
    role: UserRole.GUEST,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// 데이터베이스 마이그레이션 및 초기 데이터 삽입
async function runMigration() {
  try {
    // 데이터베이스 디렉토리 생성
    await ensureDatabaseDirectory()

    // 데이터베이스 연결
    const sqlite = new Database(env.DATABASE_URL)
    const db = drizzle(sqlite)

    // 스키마 생성
    console.log('데이터베이스 스키마 생성 중...')

    // users 테이블 생성
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL DEFAULT 'USER',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `)

    // sleep_records 테이블 생성
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS sleep_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        sleepStartTime TEXT NOT NULL,
        sleepEndTime TEXT NOT NULL,
        notes TEXT,
        satisfaction INTEGER NOT NULL DEFAULT 3,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 초기 데이터 삽입
    console.log('초기 데이터 삽입 중...')

    // 기존 데이터 확인
    const existingUsers = db.select().from(users)
    const existingSleepRecords = db.select().from(sleepRecords)

    if ((await existingUsers).length === 0) {
      // 초기 사용자 데이터 삽입
      for (const user of initialUsers) {
        await db.insert(users).values(user)
      }
      console.log(`${initialUsers.length}명의 사용자가 추가되었습니다.`)
    } else {
      console.log('사용자 데이터가 이미 존재합니다. 초기 데이터 삽입을 건너뜁니다.')
    }

    if ((await existingSleepRecords).length === 0) {
      // 과학적 개념 반영: 현실적인 초기 수면 데이터 생성 (최근 2개월)
      const now = new Date();
      const sleepData = [];
      for (let i = 0; i < 60; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        // 사회적 시차: 주말은 평일보다 2시간 늦게 자고 일어남
        const baseSleepStartHour = isWeekend ? 1.5 : 23.5;
        const baseSleepEndHour = isWeekend ? 9.5 : 7.5;
        // 수면 사이클(90분 단위) 반영: 6, 7.5, 9시간 등 배수로 맞추는 날이 많음
        let cycleHours = [6, 7.5, 9][Math.floor(Math.random() * 3)];
        // 20% 확률로 일부러 애매하게(사이클 깨짐)
        if (Math.random() < 0.2) cycleHours += (Math.random() - 0.5) * 0.7;
        // 취침 시간에 약간의 변동성
        const sleepStartHour = baseSleepStartHour + (Math.random() - 0.5) * 0.5;
        const sleepStart = new Date(date);
        sleepStart.setHours(Math.floor(sleepStartHour));
        sleepStart.setMinutes(Math.floor((sleepStartHour % 1) * 60));
        // 기상 시간 = 취침 시간 + cycleHours
        const sleepEnd = new Date(sleepStart);
        sleepEnd.setHours(sleepEnd.getHours() + Math.floor(cycleHours));
        sleepEnd.setMinutes(sleepEnd.getMinutes() + Math.floor((cycleHours % 1) * 60));
        // 만족도: 90분 배수(6,7.5,9)에 가까우면 4~5, 사이클 깨지면 2~3
        // 주말 사회적 시차(2시간 이상 차이)면 만족도 2~3
        let satisfaction = 4;
        const cycleRemainder = Math.abs((cycleHours * 60) % 90);
        if (cycleRemainder > 15) satisfaction = 2 + Math.round(Math.random());
        else if (cycleHours < 6) satisfaction = 2 + Math.round(Math.random());
        else satisfaction = 4 + Math.round(Math.random());
        // 주말 사회적 시차(2시간 이상)면 만족도 낮게
        if (isWeekend && Math.abs(baseSleepStartHour - 23.5) >= 2) satisfaction = 2 + Math.round(Math.random());
        // 특이사항: 15% 확률로 추가
        const notes = Math.random() < 0.15 ? (satisfaction <= 3 ? '잠을 설쳤다.' : '수면의 질이 좋았습니다.') : null;
        sleepData.push({
          userId: '1',
          sleepStartTime: sleepStart.toISOString(),
          sleepEndTime: sleepEnd.toISOString(),
          notes,
          satisfaction,
          createdAt: date.toISOString(),
          updatedAt: date.toISOString(),
        });
      }
      for (const record of sleepData) {
        await db.insert(sleepRecords).values(record);
      }
      console.log(`${sleepData.length}개의 수면 기록이 추가되었습니다.`);
    } else {
      console.log('수면 기록 데이터가 이미 존재합니다. 초기 데이터 삽입을 건너뜁니다.')
    }

    console.log('데이터베이스 마이그레이션이 완료되었습니다.')
  } catch (error) {
    console.error('데이터베이스 마이그레이션 중 오류가 발생했습니다:', error)
    process.exit(1)
  }
}

// 스크립트가 직접 실행된 경우에만 마이그레이션 실행
if (require.main === module) {
  runMigration()
}

export default runMigration
