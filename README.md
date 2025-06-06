# 수면 트래커

현대인의 수면 패턴을 관리하고 개선하기 위한 웹 애플리케이션입니다.

## 주요 기능

- 수면 시간 기록 및 관리
- 수면 패턴 분석
- 특이사항 메모 기능
- 직관적인 UI/UX

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

### 환경 변수 설정
`.env` 파일을 생성하고 다음 변수들을 설정하세요:
```
# 서버
PORT=3000
HOST=localhost
DATABASE_URL=./data/sleep.db
CORS_ORIGIN=http://localhost:5173

# 클라이언트
VITE_API_URL=http://localhost:3000/api
```

## 프로젝트 구조

```
.
├── client/                 # 프론트엔드
│   ├── src/
│   │   ├── components/    # 재사용 가능한 컴포넌트
│   │   ├── pages/        # 페이지 컴포넌트
│   │   ├── services/     # API 서비스
│   │   ├── types/        # 타입 정의
│   │   └── viewmodels/   # MVVM 패턴의 ViewModel
│   └── ...
├── server/                # 백엔드
│   ├── src/
│   │   ├── db/          # 데이터베이스 관련
│   │   ├── routes/      # API 라우트
│   │   └── services/    # 비즈니스 로직
│   └── ...
└── ...
```

## API 엔드포인트

### 수면 기록
- `POST /api/sleep` - 새로운 수면 기록 생성
- `GET /api/sleep/:userId` - 사용자의 수면 기록 목록 조회
- `PUT /api/sleep/:id` - 수면 기록 수정
- `DELETE /api/sleep/:id` - 수면 기록 삭제

## 라이선스

MIT
