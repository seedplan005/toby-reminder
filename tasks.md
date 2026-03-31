# Toby Reminder - Tasks

## Phase 1 - 백엔드 기본 API + 최소 프론트엔드

### Backend
- [ ] `application.yml` 설정 (H2 datasource, JPA ddl-auto, H2 콘솔 활성화)
- [ ] `Reminder` Entity 생성 (id, title, completed, createdAt, updatedAt)
- [ ] `ReminderRepository` 생성 (JpaRepository)
- [ ] `ReminderService` 생성 (CRUD + 완료 토글 로직)
- [ ] `ReminderController` 생성
  - [ ] `GET /api/reminders` - 전체 조회
  - [ ] `POST /api/reminders` - 생성
  - [ ] `PUT /api/reminders/{id}` - 수정
  - [ ] `DELETE /api/reminders/{id}` - 삭제
  - [ ] `PATCH /api/reminders/{id}/complete` - 완료 토글
- [ ] API 동작 테스트 (H2 콘솔로 데이터 확인)

### Frontend
- [ ] Next.js 프로젝트 초기화 (`frontend/`, App Router, TypeScript)
- [ ] API 프록시 설정 (`next.config.ts` rewrites → `localhost:8080`)
- [ ] API 클라이언트 유틸 생성 (`lib/api.ts`)
- [ ] 리마인더 목록 페이지 구현 (`app/page.tsx`)
  - [ ] 리마인더 목록 표시
  - [ ] 완료 체크 토글 (원형 체크박스)
  - [ ] 하단 인라인 입력으로 리마인더 추가
  - [ ] 삭제 버튼
- [ ] 기본 Apple 스타일 CSS 적용 (시스템 폰트, 흰색 배경, 완료 원 스타일)
- [ ] Phase 1 통합 테스트 (Backend + Frontend 연동 확인)

---

## Phase 2 - 리스트 관리 + 사이드바 레이아웃

### Backend
- [ ] `ReminderList` Entity 생성 (id, name, color, icon, displayOrder)
- [ ] `Reminder`에 `list_id` FK 추가, `@ManyToOne` 연관관계 설정
- [ ] `ReminderListRepository` 생성
- [ ] `ReminderListService` 생성 (CRUD + 리마인더 건수 조회)
- [ ] `ReminderListController` 생성
  - [ ] `GET /api/lists` - 전체 리스트 조회 (리마인더 건수 포함)
  - [ ] `POST /api/lists` - 생성
  - [ ] `PUT /api/lists/{id}` - 수정
  - [ ] `DELETE /api/lists/{id}` - 삭제
- [ ] `GET /api/reminders`에 `listId` 쿼리 파라미터 필터 추가
- [ ] 기본 리스트 초기 데이터 설정 (data.sql 또는 ApplicationRunner)

### Frontend
- [ ] 사이드바 + 메인 영역 2단 레이아웃 구현 (250px 사이드바, #F2F1F6 배경)
- [ ] 사이드바 리스트 목록 컴포넌트 (컬러 도트 + 이름 + 건수)
- [ ] 리스트 클릭 시 해당 리스트 리마인더 표시 (상태 관리)
- [ ] 리스트 생성 모달 (이름 입력 + 12색 팔레트 색상 선택)
- [ ] 리스트 수정/삭제 기능
- [ ] 메인 영역: 선택된 리스트 제목 표시 + 리마인더 행에 리스트 색상 반영
- [ ] Phase 2 통합 테스트

---

## Phase 3 - 리마인더 상세 속성 + 상세 패널

### Backend
- [ ] `Reminder` Entity에 필드 추가 (notes, dueDate, dueTime, priority, flagged, completedAt)
- [ ] `Priority` Enum 생성 (NONE, LOW, MEDIUM, HIGH)
- [ ] `PATCH /api/reminders/{id}/flag` - 깃발 토글 API
- [ ] `GET /api/reminders` 쿼리 파라미터 확장 (completed, flagged, dueDate, dueBefore, priority)

### Frontend
- [ ] 리마인더 상세 패널 컴포넌트 (메인 영역 하단 인라인)
  - [ ] 제목 입력 (볼드)
  - [ ] 메모 textarea
  - [ ] 날짜 피커
  - [ ] 시간 피커
  - [ ] 우선순위 세그먼트 컨트롤 (없음/낮음/중간/높음)
  - [ ] 깃발 토글
  - [ ] 리스트 변경 드롭다운
- [ ] 리마인더 행 디자인 강화
  - [ ] 메모 미리보기 (한 줄, 회색)
  - [ ] 마감일 표시 (지난 날짜 빨간색)
  - [ ] 깃발 아이콘 표시
  - [ ] 우선순위 느낌표 (완료 원 안)
- [ ] 완료 애니메이션 (원 체크 → 채움 → 0.5초 후 페이드아웃)
- [ ] Phase 3 통합 테스트

---

## Phase 4 - 스마트 리스트 + 홈 화면

### Backend
- [ ] `GET /api/reminders/counts` API (today, scheduled, all, flagged, completed)
- [ ] 스마트 리스트 조건별 쿼리 최적화

### Frontend
- [ ] 홈 화면 구현 (스마트 리스트 카드 그리드, 2열)
  - [ ] 카드 컴포넌트 (원형 아이콘 + 이름 + 건수)
  - [ ] 색상: 오늘=파랑, 예정=빨강, 전체=검정, 깃발=주황, 완료됨=회색
- [ ] 사이드바 스마트 리스트 섹션 (아이콘 + 이름 + 건수 배지)
- [ ] 스마트 리스트와 내 리스트 섹션 구분선
- [ ] 스마트 리스트 클릭 시 필터된 리마인더 표시
  - [ ] 오늘: 마감일이 오늘
  - [ ] 예정: 마감일이 미래
  - [ ] 전체: 모든 미완료
  - [ ] 깃발: flagged=true
  - [ ] 완료됨: completed=true
- [ ] 사이드바 상단 검색 바 (제목/메모 기준 필터링)
- [ ] Phase 4 통합 테스트

---

## Phase 5 - 정렬, 애니메이션, 인터랙션 강화

### Backend
- [ ] `PATCH /api/reminders/reorder` - 리마인더 순서 변경 API
- [ ] `PATCH /api/lists/reorder` - 리스트 순서 변경 API

### Frontend
- [ ] 드래그 앤 드롭: 리마인더 순서 변경 (리스트 내)
- [ ] 드래그 앤 드롭: 리스트 순서 변경 (사이드바)
- [ ] 리스트 전환 트랜지션 (페이드 + 슬라이드, 150ms ease-out)
- [ ] 사이드바 접기/펼치기 슬라이드 애니메이션
- [ ] 리마인더 삭제: 스와이프 또는 컨텍스트 메뉴
- [ ] Hover 효과 (행 배경색 변화)
- [ ] 키보드 단축키 (N=추가, Delete=삭제, ↑↓=이동)
- [ ] Phase 5 통합 테스트

---

## Phase 6 - 다크모드 + 반응형 + 마무리

### Frontend
- [ ] CSS custom properties 기반 다크모드 색상 체계
- [ ] `prefers-color-scheme` 자동 감지
- [ ] 다크모드 수동 토글 버튼 (사이드바 하단)
- [ ] 반응형: Desktop (>1024px) - 사이드바 + 메인 + 상세 패널
- [ ] 반응형: Tablet (768-1024px) - 사이드바 접힘 가능 + 메인
- [ ] 반응형: Mobile (<768px) - 화면 전환 네비게이션 스택
- [ ] 리스트 아이콘 선택 UI (생성/편집 모달)
- [ ] 전체 UI Apple 디자인 일관성 최종 점검
- [ ] Phase 6 통합 테스트
