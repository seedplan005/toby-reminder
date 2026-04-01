package ai.toby.reminder.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ReminderTest {

    @Test
    @DisplayName("생성자로 리마인더를 만들면 title이 설정되고 completed는 false이다")
    void createWithTitle() {
        Reminder reminder = new Reminder("장보기");

        assertThat(reminder.getTitle()).isEqualTo("장보기");
        assertThat(reminder.isCompleted()).isFalse();
    }

    @Test
    @DisplayName("생성하면 createdAt과 updatedAt이 설정된다")
    void createSetsTimestamps() {
        Reminder reminder = new Reminder("장보기");

        assertThat(reminder.getCreatedAt()).isNotNull();
        assertThat(reminder.getUpdatedAt()).isNotNull();
        assertThat(reminder.getCreatedAt()).isEqualTo(reminder.getUpdatedAt());
    }

    @Test
    @DisplayName("update하면 title이 변경되고 updatedAt이 갱신된다")
    void updateChangesTitle() throws Exception {
        Reminder reminder = new Reminder("장보기");
        var originalUpdatedAt = reminder.getUpdatedAt();

        Thread.sleep(10);

        reminder.update("운동하기");

        assertThat(reminder.getTitle()).isEqualTo("운동하기");
        assertThat(reminder.getUpdatedAt()).isAfter(originalUpdatedAt);
    }

    @Test
    @DisplayName("toggleComplete하면 completed 상태가 반전된다")
    void toggleComplete() {
        Reminder reminder = new Reminder("장보기");
        assertThat(reminder.isCompleted()).isFalse();

        reminder.toggleComplete();
        assertThat(reminder.isCompleted()).isTrue();

        reminder.toggleComplete();
        assertThat(reminder.isCompleted()).isFalse();
    }
}
