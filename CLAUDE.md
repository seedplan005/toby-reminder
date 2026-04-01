# Coding Convention

## Backend 관례

### 패키지 구조
```
ai.toby.reminder
├── domain              # Entity, Repository
├── service
│   ├── port
│   │   └── input       # Service 인터페이스
│   └── Default*.java   # Service 구현체
└── controller          # REST API
```

### Service 계층 설계 규칙
- Service는 반드시 **인터페이스와 구현체를 분리**한다.
- 인터페이스는 `service/port/input` 패키지에 위치한다.
- 구현체는 `service` 패키지에 위치하며, 클래스명 앞에 `Default`를 붙인다.
  - 예: `service/port/input/ReminderService.java` (인터페이스)
  - 예: `service/DefaultReminderService.java` (구현체)

### Entity
- `@PrePersist`/`@PreUpdate` 사용 금지 — 생성자와 비즈니스 메서드에서 `createdAt`/`updatedAt` 직접 관리
- Setter 사용 금지 — 의미 있는 비즈니스 메서드로 상태 변경

## 테스트 관례
- 기능 추가/수정 시 반드시 테스트를 함께 작성한다.
- `@DisplayName`으로 한글 설명 작성, 메서드명은 영어 camelCase
- **Entity 테스트**: 순수 단위 테스트 (JPA, Spring Context 사용 금지)
- **Service 테스트**: `@SpringBootTest` 통합 테스트로 작성 (Mock 사용 금지)
