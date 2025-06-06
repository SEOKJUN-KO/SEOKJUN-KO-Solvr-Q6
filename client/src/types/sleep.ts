export type SleepRecord = {
  id: number;
  userId: string;
  sleepStartTime: string;
  sleepEndTime: string;
  notes?: string;
  satisfaction: number; // 1-5 사이의 만족도
  createdAt: string;
  updatedAt: string;
};

export type NewSleepRecord = Omit<SleepRecord, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateSleepRecord = Omit<SleepRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>; 