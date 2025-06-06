import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './routes/HomePage'
import UsersPage from './routes/UsersPage'
import UserDetailPage from './routes/UserDetailPage'
import CreateUserPage from './routes/CreateUserPage'
import EditUserPage from './routes/EditUserPage'
import NotFoundPage from './routes/NotFoundPage'
import { SleepTracker } from './pages/SleepTracker'
import { SleepViewModel } from './viewmodels/SleepViewModel'

// 임시 사용자 ID (실제로는 로그인 시스템에서 가져와야 함)
const TEMP_USER_ID = '1';

function App() {
  const sleepViewModel = new SleepViewModel();

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="sleep" element={<SleepTracker viewModel={sleepViewModel} userId={TEMP_USER_ID} />} />
        <Route path="users">
          <Route index element={<UsersPage />} />
          <Route path="new" element={<CreateUserPage />} />
          <Route path=":id" element={<UserDetailPage />} />
          <Route path=":id/edit" element={<EditUserPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
