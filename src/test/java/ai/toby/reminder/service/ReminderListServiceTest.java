package ai.toby.reminder.service;

import ai.toby.reminder.domain.Reminder;
import ai.toby.reminder.domain.ReminderList;
import ai.toby.reminder.domain.ReminderListRepository;
import ai.toby.reminder.domain.ReminderRepository;
import ai.toby.reminder.service.port.input.ReminderListService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Transactional
class ReminderListServiceTest {

    @Autowired
    private ReminderListService reminderListService;

    @Autowired
    private ReminderListRepository reminderListRepository;

    @Autowired
    private ReminderRepository reminderRepository;

    @BeforeEach
    void setUp() {
        reminderRepository.deleteAll();
        reminderListRepository.deleteAll();
    }

    @Test
    @DisplayName("create는 리스트를 저장하고 id를 부여한다")
    void create() {
        ReminderList result = reminderListService.create("업무", "#007AFF", "briefcase.fill");

        assertThat(result.getId()).isNotNull();
        assertThat(result.getName()).isEqualTo("업무");
        assertThat(result.getColor()).isEqualTo("#007AFF");
    }

    @Test
    @DisplayName("findAll은 displayOrder 오름차순으로 반환한다")
    void findAll() {
        reminderListService.create("세 번째", "#FF3B30", null);
        reminderListService.create("네 번째", "#34C759", null);

        List<ReminderList> result = reminderListService.findAll();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getDisplayOrder()).isLessThanOrEqualTo(result.get(1).getDisplayOrder());
    }

    @Test
    @DisplayName("findById는 존재하지 않으면 예외를 던진다")
    void findByIdNotFound() {
        assertThatThrownBy(() -> reminderListService.findById(999L))
                .isInstanceOf(NoSuchElementException.class);
    }

    @Test
    @DisplayName("update는 name, color, icon을 변경한다")
    void update() {
        ReminderList saved = reminderListService.create("업무", "#007AFF", "briefcase.fill");

        ReminderList result = reminderListService.update(saved.getId(), "개인", "#34C759", "person.fill");

        assertThat(result.getName()).isEqualTo("개인");
        assertThat(result.getColor()).isEqualTo("#34C759");
        assertThat(result.getIcon()).isEqualTo("person.fill");
    }

    @Test
    @DisplayName("delete는 리스트를 삭제하고 연관된 Reminder의 list를 null로 설정한다")
    void delete() {
        ReminderList list = reminderListService.create("업무", "#007AFF", null);
        Reminder reminder = reminderRepository.save(new Reminder("회의 준비", list));

        reminderListService.delete(list.getId());

        assertThat(reminderListRepository.findById(list.getId())).isEmpty();
        Reminder updated = reminderRepository.findById(reminder.getId()).orElseThrow();
        assertThat(updated.getList()).isNull();
    }

    @Test
    @DisplayName("getIncompleteCountMap은 완료된 리마인더를 제외하고 카운트한다")
    void getIncompleteCountMap() {
        ReminderList list = reminderListService.create("업무", "#007AFF", null);
        Reminder r1 = reminderRepository.save(new Reminder("할 일 1", list));
        Reminder r2 = reminderRepository.save(new Reminder("할 일 2", list));
        r2.toggleComplete();
        reminderRepository.save(r2);

        Map<Long, Long> countMap = reminderListService.getIncompleteCountMap();

        assertThat(countMap.get(list.getId())).isEqualTo(1L);
    }
}
