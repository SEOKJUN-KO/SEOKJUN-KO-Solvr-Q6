import { SleepAnalysis } from '../components/SleepAnalysis';

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="analysis-section">
        <SleepAnalysis sleepData={latestSleepData} />
      </div>
    </div>
  );
} 