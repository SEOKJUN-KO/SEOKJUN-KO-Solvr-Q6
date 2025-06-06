import { eq, and, gte, lte } from 'drizzle-orm'
import { sleepRecords } from '../db/schema'
import { Database } from '../types/database'
import { SleepRecord, NewSleepRecord, UpdateSleepRecord } from '../types/sleep'

type SleepServiceDeps = {
  db: Database
}

export type SleepService = ReturnType<typeof createSleepService>

export const createSleepService = ({ db }: SleepServiceDeps) => {
  const createRecord = async (record: NewSleepRecord): Promise<SleepRecord> => {
    const [newRecord] = await db.insert(sleepRecords).values(record).returning()
    return newRecord
  }

  const getRecords = async (userId: string, startDate?: Date, endDate?: Date): Promise<SleepRecord[]> => {
    let query = db.select().from(sleepRecords)
      .where(eq(sleepRecords.userId, userId));

    if (startDate && endDate) {
      query = query.where(
        and(
          gte(sleepRecords.sleepStartTime, startDate.toISOString()),
          lte(sleepRecords.sleepStartTime, endDate.toISOString())
        )
      );
    }

    return query.orderBy(sleepRecords.createdAt);
  }

  const updateRecord = async (id: number, record: UpdateSleepRecord): Promise<SleepRecord | undefined> => {
    const [updatedRecord] = await db.update(sleepRecords)
      .set({
        ...record,
        updatedAt: new Date().toISOString()
      })
      .where(eq(sleepRecords.id, id))
      .returning()
    return updatedRecord
  }

  const deleteRecord = async (id: number): Promise<boolean> => {
    const result = await db.delete(sleepRecords)
      .where(eq(sleepRecords.id, id))
      .returning({ id: sleepRecords.id })
    return result.length > 0
  }

  return {
    createRecord,
    getRecords,
    updateRecord,
    deleteRecord
  }
} 