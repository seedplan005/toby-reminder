package ai.toby.reminder.service;

import ai.toby.reminder.domain.Reminder;
import ai.toby.reminder.domain.ReminderRepository;
import ai.toby.reminder.service.port.input.ReminderService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

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

        Reminder result = reminderService.update(saved.getId(), "운동하기");

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
}
