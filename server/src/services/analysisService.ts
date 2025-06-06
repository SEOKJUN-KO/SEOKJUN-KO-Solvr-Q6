import { getDb } from '../db';
import { sleepRecords } from '../db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

export async function getMonthlyAnalysis(userId: string, year: number, month: number) {
  const db = await getDb();
  // 1. 해당 월의 모든 수면 기록 조회
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);
  const records = await db.select().from(sleepRecords).where(
    and(
      eq(sleepRecords.userId, userId),
      gte(sleepRecords.sleepStartTime, startDate.toISOString()),
      lte(sleepRecords.sleepStartTime, endDate.toISOString())
    )
  );

  // 2. sleepTimeDistribution: 날짜별 취침/기상/만족도
  const sleepTimeDistribution = records.map((r: any) => ({
    date: r.sleepStartTime.slice(0, 10),
    sleepStart: r.sleepStartTime.slice(11, 16),
    sleepEnd: r.sleepEndTime.slice(11, 16),
    satisfaction: r.satisfaction
  }));

  // 3. totalSleepAndSatisfaction: 날짜별 총 수면 시간, 만족도
  const totalSleepAndSatisfaction = records.map((r: any) => {
    const start = new Date(r.sleepStartTime);
    const end = new Date(r.sleepEndTime);
    const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return {
      date: r.sleepStartTime.slice(0, 10),
      totalSleepHours: Math.round(diffHours * 100) / 100,
      satisfaction: r.satisfaction
    };
  });

  // 5. sleepCyclesByDate: 날짜별 수면 사이클 개수(소수점 1자리) + 만족도
  const sleepCyclesByDate = records.map((r: any) => {
    const start = new Date(r.sleepStartTime);
    const end = new Date(r.sleepEndTime);
    const diffMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    const cycles = Math.round((diffMinutes / 90) * 10) / 10;
    return {
      date: r.sleepStartTime.slice(0, 10),
      sleepCycles: cycles,
      satisfaction: r.satisfaction
    };
  });

  return {
    sleepTimeDistribution,
    totalSleepAndSatisfaction,
    sleepCyclesByDate
  };
}

export async function getRangeAnalysis(userId: string, start: string, end: string) {
  const db = await getDb();
  const records = await db.select().from(sleepRecords).where(
    and(
      eq(sleepRecords.userId, userId),
      gte(sleepRecords.sleepStartTime, new Date(start).toISOString()),
      lte(sleepRecords.sleepStartTime, new Date(end).toISOString())
    )
  );

  // 기존 monthly 분석과 동일하게 집계
  const sleepTimeDistribution = records.map((r: any) => ({
    date: r.sleepStartTime.slice(0, 10),
    sleepStart: r.sleepStartTime.slice(11, 16),
    sleepEnd: r.sleepEndTime.slice(11, 16),
    satisfaction: r.satisfaction
  }));
  const totalSleepAndSatisfaction = records.map((r: any) => {
    const start = new Date(r.sleepStartTime);
    const end = new Date(r.sleepEndTime);
    const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return {
      date: r.sleepStartTime.slice(0, 10),
      totalSleepHours: Math.round(diffHours * 100) / 100,
      satisfaction: r.satisfaction
    };
  });

  // 5. sleepCyclesByDate: 날짜별 수면 사이클 개수(소수점 1자리) + 만족도
  const sleepCyclesByDate = records.map((r: any) => {
    const start = new Date(r.sleepStartTime);
    const end = new Date(r.sleepEndTime);
    const diffMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    const cycles = Math.round((diffMinutes / 90) * 10) / 10;
    return {
      date: r.sleepStartTime.slice(0, 10),
      sleepCycles: cycles,
      satisfaction: r.satisfaction
    };
  });

  return {
    sleepTimeDistribution,
    totalSleepAndSatisfaction,
    sleepCyclesByDate
  };
} 