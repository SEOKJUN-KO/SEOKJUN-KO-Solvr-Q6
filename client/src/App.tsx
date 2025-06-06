import { Routes, Route } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import MainLayout from './layouts/MainLayout'
import HomePage from './routes/HomePage'
import { SleepTracker } from './pages/SleepTracker'
import UsersPage from './routes/UsersPage'
import CreateUserPage from './routes/CreateUserPage'
import UserDetailPage from './routes/UserDetailPage'
import EditUserPage from './routes/EditUserPage'
import Analysis from './pages/Analysis'
import AIAnalysis from './pages/AIAnalysis'
import NotFoundPage from './routes/NotFoundPage'
import { SleepViewModel } from './viewmodels/SleepViewModel'

// 임시 사용자 ID (실제로는 로그인 시스템에서 가져와야 함)
const TEMP_USER_ID = '1'

function App() {
  const sleepViewModel = new SleepViewModel()

  return (
    <div className="app">
      <Navigation />
      <div className="content">
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="sleep" element={<SleepTracker viewModel={sleepViewModel} userId={TEMP_USER_ID} />} />
            <Route path="analysis" element={<Analysis />} />
            <Route path="ai-analysis" element={<AIAnalysis />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </div>
    </div>
  )
}

export default App
