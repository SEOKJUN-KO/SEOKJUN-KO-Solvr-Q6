import { FastifyInstance } from 'fastify';
import { getDb } from '../db';
import { sleepRecords } from '../db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { analyzeSleepData } from '../services/aiDiagnosis';
import { AppContext } from '../types/context';

export default async function sleepRoutes(fastify: FastifyInstance, context: AppContext) {
  // 수면 기록 생성
  fastify.post('/sleep', async (request, reply) => {
    const db = await getDb();
    const { userId, sleepStartTime, sleepEndTime, notes, satisfaction } = request.body as any;

    const [record] = await db.insert(sleepRecords).values({
      userId,
      sleepStartTime,
      sleepEndTime,
      notes,
      satisfaction,
    }).returning();

    return record;
  });

  // 수면 기록 목록 조회
  fastify.get('/sleep/:userId', async (request, reply) => {
    const db = await getDb();
    const { userId } = request.params as { userId: string };
    const { startDate, endDate } = request.query as { startDate?: string; endDate?: string };

    let query = db.select().from(sleepRecords)
      .where(eq(sleepRecords.userId, userId));

    if (startDate && endDate) {
      query = query.where(
        and(
          gte(sleepRecords.sleepStartTime, startDate),
          lte(sleepRecords.sleepStartTime, endDate)
        )
      );
    }

    const records = await query.orderBy(sleepRecords.createdAt);
    return records;
  });

  // 수면 기록 수정
  fastify.put('/sleep/:id', async (request, reply) => {
    const db = await getDb();
    const { id } = request.params as { id: string };
    const { sleepStartTime, sleepEndTime, notes, satisfaction } = request.body as any;

    const [record] = await db.update(sleepRecords)
      .set({
        sleepStartTime,
        sleepEndTime,
        notes,
        satisfaction,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(sleepRecords.id, parseInt(id)))
      .returning();

    return record;
  });

  // 수면 기록 삭제
  fastify.delete('/sleep/:id', async (request, reply) => {
    const db = await getDb();
    const { id } = request.params as { id: string };

    await db.delete(sleepRecords)
      .where(eq(sleepRecords.id, parseInt(id)));

    return { success: true };
  });

  fastify.post('/analyze', async (request, reply) => {
    try {
      const body = request.body as any;
      console.log('Request body:', body); // 디버깅을 위한 로그 추가
      
      const userId = body.userId;
      if (!userId) {
        return reply.status(400).send({ error: 'userId is required' });
      }

      // 현재 날짜 기준으로 한 달 전 데이터 조회
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);

      // sleepService를 통해 데이터 조회
      const records = await context.sleepService.getRecords(userId, startDate, endDate);

      // 수면 데이터 변환
      const dailyData = records.map(record => {
        const start = new Date(record.sleepStartTime);
        const end = new Date(record.sleepEndTime);
        const totalSleepTime = Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // 분 단위

        // 수면 단계 계산 (예시: 실제로는 더 정교한 알고리즘 필요)
        const deepSleepTime = Math.round(totalSleepTime * 0.2); // 20%
        const lightSleepTime = Math.round(totalSleepTime * 0.5); // 50%
        const remSleepTime = Math.round(totalSleepTime * 0.3); // 30%

        // 수면 효율 계산 (예시)
        const sleepEfficiency = Math.round((totalSleepTime / (8 * 60)) * 100); // 8시간 기준
        const sleepScore = Math.min(100, Math.round(sleepEfficiency * (record.satisfaction / 5)));

        return {
          totalSleepTime,
          deepSleepTime,
          lightSleepTime,
          remSleepTime,
          sleepEfficiency,
          sleepScore,
          timestamp: record.sleepStartTime
        };
      });

      const sleepData = {
        userId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        dailyData
      };

      const analysis = await analyzeSleepData(sleepData);
      return { analysis };
    } catch (error) {
      console.error('수면 분석 중 오류:', error);
      reply.code(500);
      return { error: '수면 데이터 분석 중 오류가 발생했습니다.' };
    }
  });
} 