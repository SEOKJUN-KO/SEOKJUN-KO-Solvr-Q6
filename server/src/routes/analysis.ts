import { FastifyInstance } from 'fastify';
import { getMonthlyAnalysis, getRangeAnalysis } from '../services/analysisService';

export default async function analysisRoutes(fastify: FastifyInstance) {
  fastify.get('/api/analysis/monthly', async (request, reply) => {
    const { userId, year, month } = request.query as { userId: string; year: string; month: string };
    if (!userId || !year || !month) {
      return reply.status(400).send({ error: 'userId, year, month are required' });
    }
    const data = await getMonthlyAnalysis(userId, parseInt(year), parseInt(month));
    return data;
  });

  fastify.get('/api/analysis/range', async (request, reply) => {
    const { userId, start, end } = request.query as { userId: string; start: string; end: string };
    if (!userId || !start || !end) {
      return reply.status(400).send({ error: 'userId, start, end are required' });
    }
    const data = await getRangeAnalysis(userId, start, end);
    return data;
  });
} 