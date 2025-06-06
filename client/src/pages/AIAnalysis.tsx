import React, { useEffect, useState } from 'react';
import { Typography, Card, Alert, Collapse } from 'antd';
import { SleepAnalysis } from '../components/SleepAnalysis';
import { api } from '../services/api';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

// 임시 사용자 ID (실제로는 로그인 시스템에서 가져와야 함)
const TEMP_USER_ID = '1';

export default function AIAnalysis() {
  const [latestSleepData, setLatestSleepData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestSleepData = async () => {
      try {
        const response = await api.get('/sleep/latest');
        setLatestSleepData(response.data);
      } catch (err) {
        setError('최근 수면 데이터를 불러오는데 실패했습니다.');
      }
    };

    fetchLatestSleepData();
  }, []);

  return (
    <div className="ai-analysis-page">
      <Title level={2}>AI 수면 진단</Title>
      <Paragraph>
        AI가 당신의 수면 패턴을 분석하고 맞춤형 조언을 제공합니다.
        최근 수면 데이터를 기반으로 분석이 진행됩니다.
      </Paragraph>

      <Collapse className="mb-6">
        <Panel header="AI 수면 분석 기준" key="1">
          <div className="space-y-4">
            <div>
              <Text strong>분석 기간</Text>
              <Paragraph>
                - 최근 한 달간의 수면 데이터를 분석합니다.
                - 장기적인 수면 패턴과 변화를 파악할 수 있습니다.
              </Paragraph>
            </div>

            <div>
              <Text strong>수면 단계 분석</Text>
              <Paragraph>
                - 깊은 수면 (20%): 신체 회복과 면역력 강화에 중요한 단계
                - 얕은 수면 (50%): 수면의 전환 단계로, 기억 정리와 학습에 관여
                - REM 수면 (30%): 꿈을 꾸는 단계로, 정신적 회복과 감정 조절에 중요
              </Paragraph>
            </div>

            <div>
              <Text strong>수면 효율 계산</Text>
              <Paragraph>
                - 총 수면 시간을 8시간(480분)을 기준으로 백분율로 계산
                - 수면 점수는 수면 효율과 만족도를 종합적으로 고려하여 산출
              </Paragraph>
            </div>

            <div>
              <Text strong>분석 항목</Text>
              <Paragraph>
                1. 수면 상태 진단: 전반적인 수면 패턴과 특징 분석
                2. 주요 문제점: 수면의 일관성, 시간, 질 등 평가
                3. 개선 조언: 맞춤형 수면 개선 방안 제시
                4. 권장 수면 패턴: 최적의 수면 시간과 패턴 제안
              </Paragraph>
            </div>
          </div>
        </Panel>
      </Collapse>

      {error && (
        <Alert
          message="오류"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {latestSleepData ? (
        <SleepAnalysis sleepData={latestSleepData} userId={TEMP_USER_ID} />
      ) : (
        <Card>
          <Paragraph>
            수면 데이터가 없습니다. 수면 기록을 먼저 입력해주세요.
          </Paragraph>
        </Card>
      )}
    </div>
  );
} 