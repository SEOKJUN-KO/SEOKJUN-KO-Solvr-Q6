import { useEffect, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart
} from 'recharts';
import React from 'react';

const TEMP_USER_ID = '1';
const today = new Date();

function getMonday(d: Date) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // 월요일
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function Analysis() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // 2주 단위: offset=0이면 오늘 포함 2주, -1이면 이전 2주, +1이면 다음 2주
  const [offset, setOffset] = useState(0);

  // 2주 범위 계산
  const baseMonday = getMonday(today);
  const startDate = new Date(baseMonday);
  startDate.setDate(startDate.getDate() + offset * 14);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 13);

  function fetchData(start: string, end: string) {
    setLoading(true);
    setError(null);
    fetch(`/api/analysis/range?userId=${TEMP_USER_ID}&start=${start}&end=${end}`)
      .then(res => res.json())
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchData(formatDate(startDate), formatDate(endDate));
    // eslint-disable-next-line
  }, [offset]);

  // 날짜 오름차순 정렬 함수
  function sortByDate(arr: any[], key: string = 'date') {
    return [...arr].sort((a, b) => a[key].localeCompare(b[key]));
  }

  // 2주 이동 함수
  const goToPrev2Weeks = () => setOffset(o => o - 1);
  const goToNext2Weeks = () => {
    const nextStart = new Date(startDate);
    nextStart.setDate(nextStart.getDate() + 14);
    return nextStart > today ? null : setOffset(o => o + 1);
  };
  const isNext2WeeksFuture = endDate >= today;

  // 커스텀 툴팁 컴포넌트
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const sleepCycles = payload.find((p: any) => p.dataKey === 'sleepCycles')?.value;
      const satisfaction = payload.find((p: any) => p.dataKey === 'satisfaction')?.value;
      // sleepCycles(사이클 개수) * 90 = 총 수면 시간(분)
      const totalMinutes = sleepCycles * 90;
      const remainder = Math.round(totalMinutes % 90);
      let tip = '';
      if (remainder === 0) {
        tip = '이 날은 렘 수면 직후에 깬 것으로 추정됩니다. (가장 개운할 확률↑)';
      } else if (remainder >= 70) {
        tip = '이 날은 렘 수면 중에 깬 것으로 추정됩니다.';
      } else {
        tip = '이 날은 비렘 수면 중에 깬 것으로 추정됩니다.';
      }
      return (
        <div className="bg-white p-3 rounded shadow text-sm text-gray-800">
          <div><b>{label}</b></div>
          <div>수면 사이클: {sleepCycles}개</div>
          <div>만족도: {satisfaction}/5</div>
          <div className="mt-2 text-blue-600">{tip}</div>
        </div>
      );
    }
    return null;
  };

  if (loading) return <div className="p-8 text-center">로딩 중...</div>;
  if (error) return <div className="p-8 text-center text-red-500">에러: {error}</div>;
  if (!data) return <div className="p-8 text-center">데이터 없음</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <button onClick={goToPrev2Weeks} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">이전 2주</button>
        <span className="text-xl font-bold">{formatDate(startDate)} ~ {formatDate(endDate)}</span>
        <button onClick={goToNext2Weeks} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200" disabled={isNext2WeeksFuture}>다음 2주</button>
      </div>
      {/* 1. 총 수면 시간 & 만족도 */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">총 수면 시간 & 만족도</h2>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={sortByDate(data.totalSleepAndSatisfaction)} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" interval={0} angle={-30} textAnchor="end" height={60} />
            <YAxis yAxisId="left" label={{ value: '수면 시간(시간)', angle: -90, position: 'left', offset: 20 }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: '만족도', angle: 90, position: 'insideRight' }} domain={[1, 5]} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="totalSleepHours" name="총 수면 시간" fill="#6366F1" />
            <Line yAxisId="right" type="monotone" dataKey="satisfaction" name="만족도" stroke="#F59E42" strokeWidth={2} dot />
          </ComposedChart>
        </ResponsiveContainer>
      </section>
      {/* 2. 취침/기상 시간 & 만족도 */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">취침/기상 시간 & 만족도</h2>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={sortByDate(data.sleepTimeDistribution)} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" interval={0} angle={-30} textAnchor="end" height={60} />
            <YAxis yAxisId="left" label={{ value: '시각', angle: -90, position: 'left', offset: 20 }} domain={[0, 24]} tickFormatter={v => v.toFixed(1)} />
            <YAxis yAxisId="right" orientation="right" label={{ value: '만족도', angle: 90, position: 'insideRight' }} domain={[1, 5]} />
            <Tooltip formatter={(value, name) => typeof value === 'number' ? value.toFixed(1) : value} />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey={d => {
                const date = new Date(`${d.date}T${d.sleepStart}:00Z`);
                return date.getHours() + date.getMinutes() / 60;
              }}
              name="취침 시각"
              stroke="#60A5FA"
              strokeWidth={2}
              dot
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey={d => {
                const date = new Date(`${d.date}T${d.sleepEnd}:00Z`);
                return date.getHours() + date.getMinutes() / 60;
              }}
              name="기상 시각"
              stroke="#34D399"
              strokeWidth={2}
              dot
            />
            <Line yAxisId="right" type="monotone" dataKey="satisfaction" name="만족도" stroke="#F59E42" strokeWidth={2} dot />
          </ComposedChart>
        </ResponsiveContainer>
      </section>
      {/* 4. 일별 수면 사이클 개수 + 만족도 */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">일별 수면 사이클 개수 & 만족도</h2>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={sortByDate(data.sleepCyclesByDate)} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" interval={0} angle={-30} textAnchor="end" height={60} />
            <YAxis yAxisId="left" label={{ value: '수면 사이클(개)', angle: -90, position: 'left', offset: 20 }} domain={[0, 10]} tickFormatter={v => v.toFixed(1)} />
            <YAxis yAxisId="right" orientation="right" label={{ value: '만족도', angle: 90, position: 'insideRight' }} domain={[1, 5]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar yAxisId="left" dataKey="sleepCycles" name="수면 사이클 개수" fill="#4ADE80" />
            <Line yAxisId="right" type="monotone" dataKey="satisfaction" name="만족도" stroke="#F59E42" strokeWidth={2} dot />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="mt-4 text-sm text-gray-600 bg-gray-50 rounded p-3">
          <b>수면 사이클이란?</b><br />
          사람의 수면은 약 90분 단위로 얕은 수면(비렘) → 깊은 수면(렘) → 다시 얕은 수면 → ... 순환이 반복되는 구조입니다.<br />
          한 번의 사이클은 약 90분이며, 건강한 수면을 위해 4~6사이클(6~9시간) 정도가 권장됩니다.
        </div>
      </section>
    </div>
  );
} 