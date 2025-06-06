import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className="text-center">
      {/* 수면 관련 일러스트 */}
      <div className="flex justify-center mb-6">
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="56" cy="48" r="32" fill="#E0E7FF" />
          <path d="M80 48c0 17.673-14.327 32-32 32a32 32 0 1 1 0-64c2.21 0 4 1.79 4 4s-1.79 4-4 4a24 24 0 1 0 0 48c2.21 0 4 1.79 4 4s-1.79 4-4 4z" fill="#6366F1" />
          <circle cx="76" cy="28" r="3" fill="#FBBF24" />
          <circle cx="68" cy="20" r="2" fill="#FBBF24" />
          <circle cx="82" cy="36" r="1.5" fill="#FBBF24" />
        </svg>
      </div>
      <h1 className="text-4xl font-extrabold text-blue-900 mb-4 tracking-tight">Deep Sleep</h1>
      <p className="text-lg text-neutral-700 mb-8 max-w-xl mx-auto leading-relaxed">
        <span className="font-semibold text-blue-700">깊은 잠, 더 나은 하루</span><br />
        Deep Sleep은 당신의 수면 패턴을 기록하고, 주간 단위로 수면의 질과 만족도를 한눈에 확인할 수 있는 수면 관리 앱입니다.<br />
        오늘의 수면을 기록하며, 더 건강한 내일을 만들어보세요.
      </p>
      <div className="flex justify-center space-x-4 mb-12">
        <Link to="/sleep" className="px-8 py-3 rounded-lg bg-blue-600 text-white text-lg font-semibold shadow hover:bg-blue-700 transition">
          수면 기록 시작하기
        </Link>
        <Link to="/analysis" className="px-8 py-3 rounded-lg bg-amber-500 text-white text-lg font-semibold shadow hover:bg-amber-600 transition">
          수면 분석 보기
        </Link>
        <Link to="/ai-analysis" className="px-8 py-3 rounded-lg bg-purple-600 text-white text-lg font-semibold shadow hover:bg-purple-700 transition">
          AI 수면 진단
        </Link>
      </div>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">수면 기록</h2>
          <p className="text-neutral-600">
            취침/기상 시간, 수면 만족도, 특이사항을 간편하게 기록할 수 있습니다.
          </p>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">주간 통계</h2>
          <p className="text-neutral-600">
            한 주간의 수면 패턴과 만족도를 표로 확인할 수 있습니다.
          </p>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">건강한 습관</h2>
          <p className="text-neutral-600">
            꾸준한 기록을 통해 나만의 건강한 수면 루틴을 만들어보세요.
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
