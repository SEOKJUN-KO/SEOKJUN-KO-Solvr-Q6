import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

interface DailySleepData {
  totalSleepTime: number;
  deepSleepTime: number;
  lightSleepTime: number;
  remSleepTime: number;
  sleepEfficiency: number;
  sleepScore: number;
  timestamp: string;
}

interface SleepData {
  userId: string;
  startDate: string;
  endDate: string;
  dailyData: DailySleepData[];
}

export async function analyzeSleepData(sleepData: SleepData) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // 일별 데이터를 문자열로 변환
    const dailyDataString = sleepData.dailyData.map(day => `
      날짜: ${day.timestamp}
      - 총 수면 시간: ${day.totalSleepTime}분
      - 깊은 수면 시간: ${day.deepSleepTime}분
      - 얕은 수면 시간: ${day.lightSleepTime}분
      - REM 수면 시간: ${day.remSleepTime}분
      - 수면 효율: ${day.sleepEfficiency}%
      - 수면 점수: ${day.sleepScore}/100
    `).join('\n');

    const prompt = `
      다음은 ${sleepData.startDate}부터 ${sleepData.endDate}까지의 사용자 수면 데이터입니다. 
      이 데이터를 분석하여 수면 상태를 진단하고 개선을 위한 조언을 제공해주세요.
      
      수면 데이터:
      ${dailyDataString}
      
      다음 형식으로 응답해주세요:
      1. 수면 상태 진단 (전반적인 패턴과 특징)
      2. 주요 문제점 (일관성, 수면 시간, 수면의 질 등)
      3. 개선을 위한 구체적인 조언
      4. 권장 수면 시간 및 패턴
    `;
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('AI가 응답을 생성하지 못했습니다.');
    }
    
    return text;
  } catch (error) {
    console.error('AI 진단 중 오류 발생:', error);
    if (error instanceof Error) {
      throw new Error(`수면 데이터 분석 중 오류가 발생했습니다: ${error.message}`);
    }
    throw new Error('수면 데이터 분석 중 알 수 없는 오류가 발생했습니다.');
  }
} 