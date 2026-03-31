# Coding Convention

## Backend 관례

### Entity
- `@PrePersist`/`@PreUpdate` 사용 금지 — 생성자와 비즈니스 메서드에서 `createdAt`/`updatedAt` 직접 관리

## 테스트 관례
- 기능 추가/수정 시 반드시 테스트 동반 작성
- 도메인 Entity 테스트는 순수 단위 테스트
