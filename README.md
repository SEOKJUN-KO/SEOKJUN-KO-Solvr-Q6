# Deep Sleep
현대인의 수면 패턴을 관리하고 개선하기 위한 웹 애플리케이션입니다.

## 주요 기능

- 수면 시간 기록 및 관리
- 수면 패턴 분석

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

## 시작하기

### 필수 조건
- Node.js >= 22.0.0
- pnpm

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
