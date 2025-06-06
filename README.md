# Deep Sleep
현대인의 수면 패턴을 관리하고 개선하기 위한 웹 애플리케이션입니다.

## 주요 기능

- 수면 시간 기록 및 관리
- 수면 패턴 분석
- AI 기반 수면 진단 및 맞춤형 조언

## 기술 스택

### Frontend
- React
- TypeScript
- Tailwind CSS
- MobX (상태 관리)

### Backend
- Fastify
- TypeScript
- SQLite
- DrizzleORM
- Google Gemini AI

## 시작하기

### 필수 조건
- Node.js >= 22.0.0
- pnpm
- Google AI API 키

### 설치
```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

## API 엔드포인트

### 수면 기록
- `POST   /api/sleep` — 수면 기록 생성
- `GET    /api/sleep/:userId` — 수면 기록 목록 조회 (옵션: startDate, endDate)
- `PUT    /api/sleep/:id` — 수면 기록 수정
- `DELETE /api/sleep/:id` — 수면 기록 삭제

### 분석
- `GET /api/analysis/monthly?userId=...&year=...&month=...` — 월간 분석 데이터
- `GET /api/analysis/range?userId=...&start=...&end=...` — 범위 분석 데이터
- `POST /api/analyze` — AI 기반 수면 진단

### 헬스 체크
- `GET /api/health` — 서버 상태 확인

## Changelog

### Task1
- 수면 기록(취침/기상/특이사항/만족도) CRUD 및 UI 구현

### Task2
1. 사용자에게 도움이 될 수 있는 차트를 2개 이상 만들어주세요.
- 총 수면 시간 & 만족도 변화 시각화
- 취침/기상 시간 분포 & 만족도 변화 시각화
- 일별 수면 사이클 개수 & 만족도 변화 시각화

2. Test를 위해 Dummy 수면 데이터 추가

### Task3
1. AI 기반 수면 진단 기능 추가
- Google Gemini AI를 활용한 수면 패턴 분석
- 최근 한 달간의 수면 데이터 기반 분석
- 수면 단계(깊은 수면, 얕은 수면, REM 수면) 분석
- 수면 효율 및 만족도 기반 점수 산출
- 맞춤형 수면 개선 조언 제공

2. UI/UX 개선
- AI 수면 진단 페이지 추가
- 분석 기준 및 방법에 대한 상세 설명 제공
- 홈페이지에 AI 수면 진단 바로가기 버튼 추가
