export type SleepRecord = {
  id: number;
  userId: string;
  sleepStartTime: string;
  sleepEndTime: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type NewSleepRecord = Omit<SleepRecord, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateSleepRecord = Partial<Omit<SleepRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>; 