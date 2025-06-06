import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { SleepViewModel } from '../viewmodels/SleepViewModel';
import { SleepRecordList } from '../components/SleepRecordList';
import { SleepRecordForm } from '../components/SleepRecordForm';
import { SleepRecord } from '../types/sleep';

type Props = {
  viewModel: SleepViewModel;
  userId: string;
};

export const SleepTracker = observer(({ viewModel, userId }: Props) => {
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [editingRecord, setEditingRecord] = useState<SleepRecord | undefined>();

  const getWeekDates = (date: Date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay()); // 일요일로 이동
    const end = new Date(start);
    end.setDate(end.getDate() + 6); // 토요일로 이동
    return { start, end };
  };

  const formatWeekRange = (start: Date, end: Date) => {
    return `${start.getMonth() + 1}월 ${start.getDate()}일 - ${end.getMonth() + 1}월 ${end.getDate()}일`;
  };

  const moveWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const handleEditClick = (record: SleepRecord) => {
    console.log('Editing record:', record); // 디버깅용 로그
    setEditingRecord(record);
  };

  useEffect(() => {
    const { start, end } = getWeekDates(currentWeek);
    viewModel.loadRecords(userId, start, end);
  }, [viewModel, userId, currentWeek]);

  const { start, end } = getWeekDates(currentWeek);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Deep Sleep</h1>
      
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => moveWeek('prev')}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          이전 주
        </button>
        <h2 className="text-xl font-semibold">
          {formatWeekRange(start, end)}
        </h2>
        <button
          onClick={() => moveWeek('next')}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          다음 주
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <SleepRecordForm
            viewModel={viewModel}
            userId={userId}
            editingRecord={editingRecord}
            onCancel={() => setEditingRecord(undefined)}
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">수면 기록</h2>
          <SleepRecordList
            viewModel={viewModel}
            onEditClick={handleEditClick}
          />
        </div>
      </div>
    </div>
  );
}); 