import { observer } from 'mobx-react-lite';
import { useState, useEffect } from 'react';
import { SleepViewModel } from '../viewmodels/SleepViewModel';
import { NewSleepRecord, SleepRecord } from '../types/sleep';

type Props = {
  viewModel: SleepViewModel;
  userId: string;
  editingRecord?: SleepRecord;
  onCancel?: () => void;
};

const formatDateForInput = (dateString: string) => {
  const date = new Date(dateString);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const SleepRecordForm = observer(({ viewModel, userId, editingRecord, onCancel }: Props) => {
  const [formData, setFormData] = useState<NewSleepRecord>({
    userId,
    sleepStartTime: '',
    sleepEndTime: '',
    notes: '',
    satisfaction: 3,
  });

  useEffect(() => {
    if (editingRecord) {
      setFormData({
        userId,
        sleepStartTime: formatDateForInput(editingRecord.sleepStartTime),
        sleepEndTime: formatDateForInput(editingRecord.sleepEndTime),
        notes: editingRecord.notes || '',
        satisfaction: editingRecord.satisfaction,
      });
    } else {
      setFormData({
        userId,
        sleepStartTime: '',
        sleepEndTime: '',
        notes: '',
        satisfaction: 3,
      });
    }
  }, [editingRecord, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRecord) {
        await viewModel.updateRecord(editingRecord.id, {
          ...formData,
          sleepStartTime: editingRecord.sleepStartTime,
          sleepEndTime: editingRecord.sleepEndTime,
        });
        onCancel?.();
      } else {
        await viewModel.createRecord(formData);
        setFormData({
          userId,
          sleepStartTime: '',
          sleepEndTime: '',
          notes: '',
          satisfaction: 3,
        });
      }
    } catch (error) {
      console.error('수면 기록 저장 실패:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">
        {editingRecord ? '수면 기록 수정' : '수면 기록 추가'}
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">취침 시간</label>
          <input
            type="datetime-local"
            name="sleepStartTime"
            value={formData.sleepStartTime}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={viewModel.loading || editingRecord !== undefined}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">기상 시간</label>
          <input
            type="datetime-local"
            name="sleepEndTime"
            value={formData.sleepEndTime}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={viewModel.loading || editingRecord !== undefined}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          특이사항
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="수면 중 특이사항이나 느낀 점을 기록해보세요"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          수면 만족도
        </label>
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="flex flex-col items-center">
              <input
                type="radio"
                name="satisfaction"
                value={value}
                checked={formData.satisfaction === value}
                onChange={(e) => setFormData(prev => ({ ...prev, satisfaction: parseInt(e.target.value) }))}
                className="sr-only"
              />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer
                ${formData.satisfaction === value ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                {value}
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex space-x-2">
        {editingRecord && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          disabled={viewModel.loading}
          className={`${editingRecord ? 'flex-1' : 'w-full'} bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50`}
        >
          {viewModel.loading ? '저장 중...' : (editingRecord ? '수정하기' : '기록하기')}
        </button>
      </div>
    </form>
  );
}); 