package ai.toby.reminder.service;

import ai.toby.reminder.domain.Priority;
import ai.toby.reminder.domain.Reminder;
import ai.toby.reminder.domain.ReminderList;
import ai.toby.reminder.domain.ReminderListRepository;
import ai.toby.reminder.domain.ReminderRepository;
import ai.toby.reminder.service.port.input.ReminderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Transactional
class ReminderServiceTest {

    @Autowired
    private ReminderService reminderService;

    @Autowired
    private ReminderRepository reminderRepository;

    @Autowired
    private ReminderListRepository reminderListRepository;

    @BeforeEach
    void setUp() {
        reminderRepository.deleteAll();
        reminderListRepository.deleteAll();
    }

    @Test
    @DisplayName("create는 새 리마인더를 저장하고 반환한다")
    void create() {
        Reminder result = reminderService.create("장보기");

        assertThat(result.getId()).isNotNull();
        assertThat(result.getTitle()).isEqualTo("장보기");
        assertThat(result.isCompleted()).isFalse();
    }

    @Test
    @DisplayName("findAll은 모든 리마인더를 반환한다")
    void findAll() {
        reminderService.create("장보기");
        reminderService.create("운동하기");

        List<Reminder> result = reminderService.findAll();

        assertThat(result).hasSize(2);
    }

    @Test
    @DisplayName("findById는 존재하는 리마인더를 반환한다")
    void findById() {
        Reminder saved = reminderService.create("장보기");

        Reminder result = reminderService.findById(saved.getId());

        assertThat(result.getTitle()).isEqualTo("장보기");
    }

    @Test
    @DisplayName("findById는 존재하지 않으면 예외를 던진다")
    void findByIdNotFound() {
        assertThatThrownBy(() -> reminderService.findById(999L))
                .isInstanceOf(NoSuchElementException.class);
    }

    @Test
    @DisplayName("update는 title을 변경한다")
    void update() {
        Reminder saved = reminderService.create("장보기");

        Reminder result = reminderService.update(saved.getId(), "운동하기", null, null, null, null);

        assertThat(result.getTitle()).isEqualTo("운동하기");
    }

    @Test
    @DisplayName("delete는 리마인더를 삭제한다")
    void delete() {
        Reminder saved = reminderService.create("장보기");

        reminderService.delete(saved.getId());

        assertThat(reminderRepository.findById(saved.getId())).isEmpty();
    }

    @Test
    @DisplayName("toggleComplete는 완료 상태를 반전한다")
    void toggleComplete() {
        Reminder saved = reminderService.create("장보기");

        Reminder result = reminderService.toggleComplete(saved.getId());

        assertThat(result.isCompleted()).isTrue();
    }

    @Test
    @DisplayName("findAllByListId는 해당 리스트의 리마인더만 반환한다")
    void findAllByListId() {
        ReminderList list = reminderListRepository.save(new ReminderList("업무", "#007AFF", null, 0));
        reminderService.create("업무 리마인더", list.getId());
        reminderService.create("리스트 없는 리마인더");

        List<Reminder> result = reminderService.findAllByListId(list.getId());

        assertThat(result).hasSize(1);
        assertThat(result.getFirst().getTitle()).isEqualTo("업무 리마인더");
    }

    @Test
    @DisplayName("create with listId는 list가 설정된 리마인더를 생성한다")
    void createWithListId() {
        ReminderList list = reminderListRepository.save(new ReminderList("업무", "#007AFF", null, 0));

        Reminder result = reminderService.create("회의 준비", list.getId());

        assertThat(result.getList()).isNotNull();
        assertThat(result.getList().getId()).isEqualTo(list.getId());
    }

    @Test
    @DisplayName("toggleFlag는 flagged 상태를 반전한다")
    void toggleFlag() {
        Reminder saved = reminderService.create("장보기");

        Reminder result = reminderService.toggleFlag(saved.getId());

        assertThat(result.isFlagged()).isTrue();
    }

    @Test
    @DisplayName("toggleComplete는 completedAt을 설정한다")
    void toggleCompleteSetsCompletedAt() {
        Reminder saved = reminderService.create("장보기");

        Reminder result = reminderService.toggleComplete(saved.getId());

        assertThat(result.isCompleted()).isTrue();
        assertThat(result.getCompletedAt()).isNotNull();
    }

    @Test
    @DisplayName("getCounts는 각 스마트 리스트 건수를 반환한다")
    void getCounts() {
        // all 미완료 2개
        reminderService.create("항목1");
        reminderService.create("항목2");
        // completed 1개
        Reminder r3 = reminderService.create("항목3");
        reminderService.toggleComplete(r3.getId());

        ReminderCounts counts = reminderService.getCounts();

        assertThat(counts.all()).isEqualTo(2);
        assertThat(counts.completed()).isEqualTo(1);
        assertThat(counts.flagged()).isEqualTo(0);
    }

    @Test
    @DisplayName("findAllByFilter completed=true는 완료된 리마인더만 반환한다")
    void findAllByFilterCompleted() {
        Reminder r1 = reminderService.create("항목1");
        reminderService.create("항목2");
        reminderService.toggleComplete(r1.getId());

        List<Reminder> result = reminderService.findAllByFilter(
                new ReminderFilter(null, true, null, null, null, null));

        assertThat(result).hasSize(1);
        assertThat(result.getFirst().isCompleted()).isTrue();
    }

    @Test
    @DisplayName("findAllByFilter flagged=true는 깃발 리마인더만 반환한다")
    void findAllByFilterFlagged() {
        Reminder r1 = reminderService.create("항목1");
        reminderService.create("항목2");
        reminderService.toggleFlag(r1.getId());

        List<Reminder> result = reminderService.findAllByFilter(
                new ReminderFilter(null, null, true, null, null, null));

        assertThat(result).hasSize(1);
        assertThat(result.getFirst().isFlagged()).isTrue();
    }

    @Test
    @DisplayName("findAllByFilter dueDate=today는 오늘 마감 리마인더를 반환한다")
    void findAllByFilterDueToday() {
        LocalDate today = LocalDate.now();
        Reminder r1 = reminderService.create("오늘 항목");
        reminderService.update(r1.getId(), "오늘 항목", null, today, null, Priority.NONE);
        reminderService.create("마감일 없는 항목");

        List<Reminder> result = reminderService.findAllByFilter(
                new ReminderFilter(null, null, null, today, null, null));

        assertThat(result).hasSize(1);
        assertThat(result.getFirst().getDueDate()).isEqualTo(today);
    }
}
