import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { SleepViewModel } from '../viewmodels/SleepViewModel';
import { SleepRecord, UpdateSleepRecord } from '../types/sleep';

type Props = {
  viewModel: SleepViewModel;
};

export const SleepRecordList = observer(({ viewModel }: Props) => {
  const [editingRecord, setEditingRecord] = useState<SleepRecord | null>(null);
  const [editForm, setEditForm] = useState<UpdateSleepRecord>({
    sleepStartTime: '',
    sleepEndTime: '',
    notes: '',
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateSleepDuration = (start: string, end: string) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const duration = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}시간 ${minutes}분`;
  };

  const handleEditClick = (record: SleepRecord) => {
    setEditingRecord(record);
    setEditForm({
      sleepStartTime: record.sleepStartTime,
      sleepEndTime: record.sleepEndTime,
      notes: record.notes || '',
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRecord) {
      await viewModel.updateRecord(editingRecord.id, editForm);
      setEditingRecord(null);
    }
  };

  const handleEditCancel = () => {
    setEditingRecord(null);
  };

  if (viewModel.loading) {
    return <div className="text-center py-4">로딩 중...</div>;
  }

  if (viewModel.error) {
    return <div className="text-red-500 text-center py-4">{viewModel.error}</div>;
  }

  return (
    <div className="space-y-4">
      {viewModel.records.map((record: SleepRecord) => (
        <div
          key={record.id}
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">
                {formatDate(record.sleepStartTime)} - {formatDate(record.sleepEndTime)}
              </h3>
              <p className="text-gray-600">
                수면 시간: {calculateSleepDuration(record.sleepStartTime, record.sleepEndTime)}
              </p>
              {record.notes && (
                <p className="mt-2 text-gray-700">{record.notes}</p>
              )}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEditClick(record)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                수정
              </button>
              <button
                onClick={() => viewModel.deleteRecord(record.id)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      ))}
      {viewModel.records.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          수면 기록이 없습니다.
        </div>
      )}

      {/* 수정 모달 */}
      {editingRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">수면 기록 수정</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  취침 시간
                </label>
                <input
                  type="datetime-local"
                  value={editForm.sleepStartTime}
                  onChange={(e) => setEditForm(prev => ({ ...prev, sleepStartTime: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  기상 시간
                </label>
                <input
                  type="datetime-local"
                  value={editForm.sleepEndTime}
                  onChange={(e) => setEditForm(prev => ({ ...prev, sleepEndTime: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  특이사항
                </label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="수면 중 특이사항이나 느낀 점을 기록해보세요"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleEditCancel}
                  className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}); 