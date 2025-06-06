import { FastifyInstance } from 'fastify';
import { getDb } from '../db';
import { sleepRecords } from '../db/schema';
import { eq } from 'drizzle-orm';

export default async function sleepRoutes(fastify: FastifyInstance) {
  // 수면 기록 생성
  fastify.post('/sleep', async (request, reply) => {
    const db = await getDb();
    const { userId, sleepStartTime, sleepEndTime, notes } = request.body as any;

    const [record] = await db.insert(sleepRecords).values({
      userId,
      sleepStartTime,
      sleepEndTime,
      notes,
    }).returning();

    return record;
  });

  // 수면 기록 목록 조회
  fastify.get('/sleep/:userId', async (request, reply) => {
    const db = await getDb();
    const { userId } = request.params as { userId: string };

    const records = await db.select().from(sleepRecords)
      .where(eq(sleepRecords.userId, userId))
      .orderBy(sleepRecords.createdAt);

    return records;
  });

  // 수면 기록 수정
  fastify.put('/sleep/:id', async (request, reply) => {
    const db = await getDb();
    const { id } = request.params as { id: string };
    const { sleepStartTime, sleepEndTime, notes } = request.body as any;

    const [record] = await db.update(sleepRecords)
      .set({
        sleepStartTime,
        sleepEndTime,
        notes,
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
} 