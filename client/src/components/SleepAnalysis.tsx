import React, { useState } from 'react';
import { Card, Typography, Button, Spin, Alert } from 'antd';
import { api } from '../services/api';

const { Title, Paragraph } = Typography;

interface SleepAnalysisProps {
  sleepData: {
    totalSleepTime: number;
    deepSleepTime: number;
    lightSleepTime: number;
    remSleepTime: number;
    sleepEfficiency: number;
    sleepScore: number;
    timestamp: string;
  };
  userId: string;
}

export const SleepAnalysis: React.FC<SleepAnalysisProps> = ({ sleepData, userId }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/analyze', { userId });
      setAnalysis(response.data.analysis);
    } catch (err) {
      setError('수면 데이터 분석 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="sleep-analysis-card">
      <Title level={4}>AI 수면 분석</Title>
      <Paragraph>
        AI가 당신의 수면 데이터를 분석하여 맞춤형 조언을 제공합니다.
      </Paragraph>
      
      <Button 
        type="primary" 
        onClick={handleAnalyze} 
        loading={loading}
        style={{ marginBottom: 16 }}
      >
        수면 분석 시작
      </Button>

      {error && (
        <Alert
          message="오류"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin tip="수면 데이터 분석 중..." />
        </div>
      )}

      {analysis && !loading && (
        <div className="analysis-result">
          <Title level={5}>분석 결과</Title>
          <Paragraph style={{ whiteSpace: 'pre-line' }}>
            {analysis}
          </Paragraph>
        </div>
      )}
    </Card>
  );
}; 