import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { SleepViewModel } from '../viewmodels/SleepViewModel';
import { SleepRecordList } from '../components/SleepRecordList';
import { SleepRecordForm } from '../components/SleepRecordForm';

type Props = {
  viewModel: SleepViewModel;
  userId: string;
};

export const SleepTracker = observer(({ viewModel, userId }: Props) => {
  useEffect(() => {
    viewModel.loadRecords(userId);
  }, [viewModel, userId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">수면 트래커</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <SleepRecordForm viewModel={viewModel} userId={userId} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">수면 기록</h2>
          <SleepRecordList viewModel={viewModel} />
        </div>
      </div>
    </div>
  );
}); 