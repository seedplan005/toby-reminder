# Toby Reminder - 개발 계획

단순한 기능부터 점진적으로 완성도를 높여가는 방식으로 개발한다.
각 Phase 완료 시 동작하는 상태를 유지한다.

## Tech Stack

### Backend
- **Spring Boot 4.0.5** + Java 25
- **Spring Data JPA** - ORM, Repository 패턴
- **H2 Database** - 인메모리/파일 기반 DB (개발용)
- **Lombok** - 보일러플레이트 제거
- **Spring Web MVC** - REST API 서빙
- **Bean Validation** - 요청 데이터 검증

### Frontend
- **Next.js** (latest) - App Router 기반
- **React 19** + **TypeScript**
- **CSS Modules** 또는 **Tailwind CSS** - Apple 스타일 커스텀 디자인
- **fetch API** - 서버 통신 (별도 HTTP 라이브러리 불필요)

### 개발 환경
- Backend: `localhost:8080`
- Frontend: `localhost:3000` (Next.js dev server)
- Frontend → Backend 프록시: Next.js `rewrites` 설정으로 CORS 회피

---

## Phase 1 - 백엔드 기본 API + 최소 프론트엔드

> 목표: 리마인더를 생성/조회/완료할 수 있는 최소 동작 버전

### Backend
1. Entity 생성
   - `Reminder` (id, title, completed, createdAt, updatedAt)
   - 리스트 없이 단일 테이블로 시작
2. `ReminderRepository` (JpaRepository)
3. `ReminderService` - 기본 CRUD 로직
4. `ReminderController` - REST API
   - `GET /api/reminders` - 전체 조회
   - `POST /api/reminders` - 생성
   - `PUT /api/reminders/{id}` - 수정
   - `DELETE /api/reminders/{id}` - 삭제
   - `PATCH /api/reminders/{id}/complete` - 완료 토글
5. H2 콘솔 활성화 (`/h2-console`)
6. `application.yml` 설정 (datasource, jpa, h2)

### Frontend
1. Next.js 프로젝트 초기화 (`frontend/`, App Router, TypeScript)
2. API 프록시 설정 (`next.config.ts` rewrites)
3. 단일 페이지 구현
   - 리마인더 목록 표시
   - 완료 체크 토글 (원형 체크박스)
   - 하단 인라인 입력으로 리마인더 추가
   - 삭제 버튼
4. 기본 Apple 스타일 적용
   - 시스템 폰트, 흰색 배경, 깔끔한 행 디자인
   - 완료 원(○/✓) 기본 스타일

### 완료 기준
- 브라우저에서 리마인더 추가/완료/삭제가 동작
- API가 정상 응답

---

## Phase 2 - 리스트 관리 + 사이드바 레이아웃

> 목표: 리마인더를 리스트별로 분류하고, Apple 스타일 사이드바 구현

### Backend
1. `ReminderList` Entity 추가 (id, name, color, icon, displayOrder)
2. `Reminder`에 `list_id` FK 추가, 연관관계 설정
3. `ReminderListRepository`, `ReminderListService`
4. `ReminderListController` - REST API
   - `GET /api/lists` - 전체 리스트 조회 (리마인더 건수 포함)
   - `POST /api/lists` - 생성
   - `PUT /api/lists/{id}` - 수정
   - `DELETE /api/lists/{id}` - 삭제
5. `GET /api/reminders`에 `listId` 쿼리 파라미터 추가
6. 기본 리스트 초기 데이터 (data.sql 또는 ApplicationRunner)

### Frontend
1. 사이드바 + 메인 영역 2단 레이아웃 구현
   - 사이드바 너비 250px, Apple 배경색 (#F2F1F6)
2. 사이드바: 리스트 목록 표시
   - 컬러 도트(●) + 이름 + 건수
   - 리스트 클릭 시 해당 리스트 리마인더 표시
3. 리스트 생성 모달
   - 이름 입력 + 색상 선택 (12색 팔레트)
4. 리스트 수정/삭제
5. 메인 영역: 선택된 리스트 제목 + 리마인더 목록
   - 리마인더 행에 리스트 색상 반영 (완료 원 색상)

### 완료 기준
- 여러 리스트를 만들고 리스트별로 리마인더를 관리할 수 있음
- 사이드바에서 리스트 전환이 동작

---

## Phase 3 - 리마인더 상세 속성 + 상세 패널

> 목표: 리마인더에 메모, 마감일, 우선순위, 깃발 속성 추가

### Backend
1. `Reminder` Entity에 필드 추가
   - notes, dueDate, dueTime, priority(Enum), flagged, completedAt
2. `PATCH /api/reminders/{id}/flag` - 깃발 토글 API
3. `GET /api/reminders` 쿼리 파라미터 확장
   - `completed`, `flagged`, `dueDate`, `dueBefore`, `priority`

### Frontend
1. 리마인더 상세 패널 (메인 영역 하단 인라인)
   - 제목 (볼드 입력), 메모 (textarea)
   - 날짜 피커, 시간 피커
   - 우선순위 세그먼트 컨트롤 (없음/낮음/중간/높음)
   - 깃발 토글, 리스트 변경 드롭다운
2. 리마인더 행 디자인 강화
   - 메모 미리보기 (한 줄, 회색)
   - 마감일 표시 (지난 날짜 빨간색)
   - 깃발 아이콘 표시
   - 우선순위 느낌표 (완료 원 안)
3. 완료 애니메이션
   - 원 체크 → 채움 → 0.5초 후 페이드아웃/슬라이드

### 완료 기준
- 리마인더에 상세 속성을 설정하고 조회할 수 있음
- 완료 시 애니메이션 동작

---

## Phase 4 - 스마트 리스트 + 홈 화면

> 목표: 오늘/예정/전체/깃발/완료됨 스마트 필터와 홈 카드 UI

### Backend
1. 스마트 리스트용 카운트 API
   - `GET /api/reminders/counts` → `{ today, scheduled, all, flagged, completed }`
2. 각 스마트 리스트 조건에 맞는 쿼리 최적화

### Frontend
1. 홈 화면 (사이드바에서 아무 리스트도 선택하지 않은 상태)
   - 스마트 리스트 카드 그리드 (2열)
   - 각 카드: 원형 아이콘 + 이름 + 건수
   - 오늘=파랑, 예정=빨강, 전체=검정, 깃발=주황, 완료됨=회색
2. 사이드바 스마트 리스트 섹션
   - 아이콘 + 이름 + 우측 건수 배지
   - 내 리스트 섹션과 구분선으로 분리
3. 스마트 리스트 클릭 시 필터된 리마인더 표시
4. 사이드바 상단 검색 바
   - 제목/메모 기준 필터링

### 완료 기준
- 홈 화면에 스마트 리스트 카드가 건수와 함께 표시
- 각 스마트 리스트 클릭 시 올바르게 필터된 목록 표시
- 검색 동작

---

## Phase 5 - 정렬, 애니메이션, 인터랙션 강화

> 목표: Apple 수준의 인터랙션 완성도

### Backend
1. `PATCH /api/reminders/reorder` - 리마인더 순서 변경
2. `PATCH /api/lists/reorder` - 리스트 순서 변경

### Frontend
1. 드래그 앤 드롭
   - 리마인더 순서 변경 (리스트 내)
   - 리스트 순서 변경 (사이드바)
2. 리스트 전환 트랜지션 (페이드 + 슬라이드, 150ms ease-out)
3. 사이드바 접기/펼치기 (슬라이드 애니메이션)
4. 리마인더 삭제: 스와이프 또는 컨텍스트 메뉴
5. Hover 효과 (행 배경색 변화)
6. 키보드 단축키
   - `N`: 새 리마인더 추가
   - `Delete/Backspace`: 선택 항목 삭제
   - `↑/↓`: 항목 이동

### 완료 기준
- 드래그 앤 드롭으로 순서 변경이 자연스럽게 동작
- 전반적인 인터랙션이 매끄럽고 Apple 앱과 유사

---

## Phase 6 - 다크모드 + 반응형 + 마무리

> 목표: 다크모드, 반응형 디자인, 전체 완성도 향상

### Frontend
1. CSS custom properties 기반 다크모드
   - `prefers-color-scheme` 자동 감지
   - 수동 토글 버튼 (사이드바 하단)
2. 반응형 레이아웃
   - Desktop (>1024px): 사이드바 + 메인 + 상세 패널
   - Tablet (768-1024px): 사이드바 접힘 가능 + 메인
   - Mobile (<768px): 화면 전환 네비게이션 스택
3. 리스트 아이콘 선택 UI (생성/편집 모달)
4. 전체 UI 포인트 점검 및 Apple 디자인 일관성 보정

### 완료 기준
- 다크모드가 자연스럽게 동작
- 모바일/태블릿에서도 사용 가능
- Apple Reminder 앱과 시각적으로 유사한 완성된 UI
