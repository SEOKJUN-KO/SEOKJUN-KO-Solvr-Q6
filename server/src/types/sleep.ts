export interface SleepRecord {
  id: number
  userId: string
  sleepStartTime: string
  sleepEndTime: string
  notes: string | null
  satisfaction: number
  createdAt: string | null
  updatedAt: string | null
}

export type NewSleepRecord = Omit<SleepRecord, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateSleepRecord = Omit<SleepRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'> 