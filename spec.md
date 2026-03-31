# Toby Reminder - Spec

Apple Reminder App의 핵심 기능을 웹으로 구현한 할 일 관리 애플리케이션.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 4.0.5, Java 25, Spring Data JPA, H2 |
| Frontend | Next.js (latest), React, TypeScript |
| API 통신 | REST API (JSON) |

## 핵심 기능

### 1. 리마인더 CRUD

- 리마인더 생성 (제목, 메모, 마감일, 우선순위, 리스트 지정)
- 리마인더 조회 (전체, 리스트별, 필터별)
- 리마인더 수정
- 리마인더 삭제
- 리마인더 완료/미완료 토글

### 2. 리스트 관리

- 리스트 생성 (이름, 색상, 아이콘)
- 리스트 수정/삭제
- 리스트별 리마인더 조회
- 리스트 순서 변경

### 3. 스마트 리스트 (시스템 필터)

| 스마트 리스트 | 조건 |
|-------------|------|
| 오늘 | 마감일이 오늘인 항목 |
| 예정 | 마감일이 설정된 미래 항목 |
| 전체 | 모든 미완료 항목 |
| 깃발 | 깃발 표시된 항목 |
| 완료됨 | 완료된 항목 |

### 4. 리마인더 속성

| 속성 | 타입 | 설명 |
|------|------|------|
| title | String | 제목 (필수) |
| notes | String | 메모 (선택) |
| dueDate | LocalDate | 마감일 (선택) |
| dueTime | LocalTime | 마감 시간 (선택) |
| priority | Enum | NONE, LOW, MEDIUM, HIGH |
| flagged | Boolean | 깃발 표시 여부 |
| completed | Boolean | 완료 여부 |
| completedAt | LocalDateTime | 완료 시각 |
| listId | Long | 소속 리스트 |
| displayOrder | Integer | 정렬 순서 |

## API 설계

### 리스트 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/lists | 전체 리스트 조회 |
| POST | /api/lists | 리스트 생성 |
| PUT | /api/lists/{id} | 리스트 수정 |
| DELETE | /api/lists/{id} | 리스트 삭제 |
| PATCH | /api/lists/reorder | 리스트 순서 변경 |

### 리마인더 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/reminders | 전체 리마인더 조회 (필터 지원) |
| GET | /api/reminders/{id} | 리마인더 상세 조회 |
| POST | /api/reminders | 리마인더 생성 |
| PUT | /api/reminders/{id} | 리마인더 수정 |
| DELETE | /api/reminders/{id} | 리마인더 삭제 |
| PATCH | /api/reminders/{id}/complete | 완료 토글 |
| PATCH | /api/reminders/{id}/flag | 깃발 토글 |
| PATCH | /api/reminders/reorder | 순서 변경 |

### 쿼리 파라미터 (GET /api/reminders)

- `listId` - 특정 리스트의 리마인더
- `completed` - 완료 여부 필터
- `flagged` - 깃발 필터
- `dueDate` - 특정 날짜 필터
- `dueBefore` - 해당 날짜 이전
- `priority` - 우선순위 필터

## 데이터 모델

### ReminderList

```
id (PK, Long)
name (String, NOT NULL)
color (String) - hex color code
icon (String) - 아이콘 식별자
displayOrder (Integer)
createdAt (LocalDateTime)
updatedAt (LocalDateTime)
```

### Reminder

```
id (PK, Long)
title (String, NOT NULL)
notes (String)
dueDate (LocalDate)
dueTime (LocalTime)
priority (Enum: NONE, LOW, MEDIUM, HIGH)
flagged (Boolean, default false)
completed (Boolean, default false)
completedAt (LocalDateTime)
displayOrder (Integer)
list_id (FK -> ReminderList)
createdAt (LocalDateTime)
updatedAt (LocalDateTime)
```

## UI/UX 디자인 (Apple Reminder 스타일)

### 디자인 원칙

- Apple Reminder 앱의 룩앤필을 최대한 충실하게 재현
- macOS 스타일의 클린하고 미니멀한 디자인
- SF Pro 대신 시스템 폰트(-apple-system, BlinkMacSystemFont) 사용
- Apple 특유의 부드러운 애니메이션과 트랜지션

### 색상 시스템

| 요소 | Light Mode | Dark Mode |
|------|-----------|-----------|
| 배경 (사이드바) | #F2F1F6 | #1C1C1E |
| 배경 (메인) | #FFFFFF | #2C2C2E |
| 텍스트 (기본) | #1C1C1E | #FFFFFF |
| 텍스트 (보조) | #8E8E93 | #8E8E93 |
| 구분선 | #E5E5EA | #38383A |
| 선택 하이라이트 | #007AFF (10% opacity) | #0A84FF (15% opacity) |
| 리스트 기본 색상 | #007AFF, #FF9500, #FF3B30, #34C759, #AF52DE, #FF2D55 | 동일 (밝기 조정) |

### 스마트 리스트 카드 (홈 화면)

Apple Reminder의 상단 그리드 카드 UI를 재현:

```
+------------+------------+------------+------------+
|  📅 오늘   |  📋 예정   |  📦 전체   |  🏳 깃발   |
|        3   |        12  |        24  |         5  |
+------------+------------+------------+------------+
|  ✅ 완료됨  |
|        48  |
+------------+
```

- 2x3 또는 자동 그리드 (반응형)
- 각 카드: 둥근 모서리(12px), 아이콘 + 이름 + 건수 표시
- 카드 아이콘은 원형 배경에 SF Symbols 스타일 아이콘
- 오늘=파랑, 예정=빨강, 전체=검정/흰색, 깃발=주황, 완료됨=회색

### 레이아웃 구조

```
+--250px--+--------- flex-1 ---------+
|         |                          |
| Sidebar | Content Area             |
|         |                          |
| [검색]   | [스마트 리스트 카드 그리드] |
|         |  (홈 화면일 때)            |
| 스마트    |                          |
| 리스트    | 또는                     |
| (카운트)  |                          |
|         | [리스트 제목]    [···] 메뉴|
| ─────── | [리마인더 행]              |
|         |   ○ 제목                  |
| 내 리스트 |     메모 (회색, 1줄)      |
|  ● 리스트1|     📅 날짜              |
|  ● 리스트2|   ○ 제목          🚩     |
|  ● 리스트3|                          |
|         | [+ 리마인더 추가]          |
| ─────── |                          |
| [+리스트] +--------------------------+
|         | Detail Panel (인라인)     |
|         |  제목 입력                |
|         |  메모 입력                |
|         |  날짜 | 시간 | 우선순위   |
|         |  깃발 토글                |
+---------+--------------------------+
```

### 사이드바 상세

- **검색 바**: 상단 고정, Apple 스타일 둥근 검색 입력 (#E5E5EA 배경)
- **스마트 리스트 섹션**: 아이콘 + 이름 + 우측 건수 배지
  - 오늘 / 예정 / 전체 / 깃발 / 완료됨
  - 선택 시 #007AFF 배경 하이라이트
- **내 리스트 섹션**: 컬러 도트(●) + 이름 + 우측 건수
  - 각 리스트의 테마 색상으로 도트 표시
- **리스트 추가 버튼**: 하단 고정, "+ 리스트 추가" 텍스트

### 리마인더 행 디자인

```
┌──────────────────────────────────────────┐
│  ○  리마인더 제목                    🚩  │
│     메모 텍스트 (회색, 한 줄)             │
│     📅 4월 3일                          │
└──────────────────────────────────────────┘
```

- **완료 원**: 빈 원(○) → 클릭 시 체크 애니메이션(✓) → 0.5초 후 페이드아웃
  - 원 색상: 소속 리스트의 테마 색상
  - 우선순위 표시: LOW=느낌표 1개, MEDIUM=2개, HIGH=3개 (원 안에)
- **제목**: 기본 텍스트, 완료 시 취소선 + 회색 처리
- **메모**: #8E8E93 색상, 한 줄 말줄임
- **날짜**: 아이콘 + 날짜 텍스트, 지난 날짜는 빨간색
- **깃발**: 🚩 주황색 아이콘, 토글 가능

### 상세 패널 (Detail)

리마인더 선택 시 메인 영역 하단 또는 우측에 인라인 표시:

| 필드 | UI 요소 |
|------|--------|
| 제목 | 큰 텍스트 입력 (볼드) |
| 메모 | 멀티라인 텍스트영역 |
| 날짜 | 토글 스위치 + 날짜 피커 (Apple 스타일 캘린더) |
| 시간 | 토글 스위치 + 시간 피커 |
| 우선순위 | 세그먼트 컨트롤 (없음/낮음/중간/높음) |
| 깃발 | 토글 스위치 |
| 리스트 | 드롭다운 (컬러 도트 + 이름) |

### 리스트 생성/편집 모달

- 모달 다이얼로그 (Apple 스타일 둥근 모서리)
- 리스트 이름 입력
- 색상 선택: 12가지 프리셋 원형 색상 팔레트
- 아이콘 선택: 카테고리별 아이콘 그리드

### 주요 인터랙션 & 애니메이션

- **완료 토글**: 원 체크 → 채움 애니메이션 → 딜레이 후 목록에서 슬라이드 아웃
- **리마인더 추가**: 목록 하단 "+ 리마인더" 클릭 → 인라인 입력 행 생성 (포커스)
- **삭제**: 좌측 스와이프 또는 우클릭 컨텍스트 메뉴 → 빨간 "삭제" 버튼
- **드래그 앤 드롭**: 리마인더 순서 변경, 리스트 간 이동
- **사이드바 접기**: 토글 버튼으로 사이드바 숨김/표시 (슬라이드 애니메이션)
- **트랜지션**: 리스트 전환 시 페이드 + 슬라이드 (150ms ease-out)
- **Hover 효과**: 리마인더 행 hover 시 미세한 배경색 변화

### 반응형 디자인

| 화면 크기 | 레이아웃 |
|----------|---------|
| Desktop (>1024px) | 사이드바 + 메인 + 상세 패널 |
| Tablet (768-1024px) | 사이드바 접힘 가능 + 메인 |
| Mobile (<768px) | 네비게이션 스택 (화면 전환) |

### 다크모드

- `prefers-color-scheme` 미디어 쿼리로 시스템 설정 자동 감지
- 토글 버튼으로 수동 전환 가능
- 모든 색상 변수는 CSS custom properties로 관리

