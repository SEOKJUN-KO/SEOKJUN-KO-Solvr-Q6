import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { SleepViewModel } from '../viewmodels/SleepViewModel';
import { NewSleepRecord } from '../types/sleep';

type Props = {
  viewModel: SleepViewModel;
  userId: string;
};

export const SleepRecordForm = observer(({ viewModel, userId }: Props) => {
  const [formData, setFormData] = useState<NewSleepRecord>({
    userId,
    sleepStartTime: '',
    sleepEndTime: '',
    notes: '',
    satisfaction: 3,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await viewModel.createRecord(formData);
      setFormData({
        userId,
        sleepStartTime: '',
        sleepEndTime: '',
        notes: '',
        satisfaction: 3,
      });
    } catch (error) {
      console.error('수면 기록 생성 실패:', error);
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
      <h2 className="text-xl font-semibold mb-4">수면 기록 추가</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          취침 시간
        </label>
        <input
          type="datetime-local"
          name="sleepStartTime"
          value={formData.sleepStartTime}
          onChange={handleChange}
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
          name="sleepEndTime"
          value={formData.sleepEndTime}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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

      <button
        type="submit"
        disabled={viewModel.loading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {viewModel.loading ? '저장 중...' : '기록하기'}
      </button>
    </form>
  );
}); 