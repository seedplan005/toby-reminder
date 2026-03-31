package ai.toby.reminder.domain;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ReminderTest {

    @Test
    void 생성자로_리마인더를_만들면_title이_설정되고_completed는_false이다() {
        Reminder reminder = new Reminder("장보기");

        assertThat(reminder.getTitle()).isEqualTo("장보기");
        assertThat(reminder.isCompleted()).isFalse();
    }

    @Test
    void 생성하면_createdAt과_updatedAt이_설정된다() {
        Reminder reminder = new Reminder("장보기");

        assertThat(reminder.getCreatedAt()).isNotNull();
        assertThat(reminder.getUpdatedAt()).isNotNull();
        assertThat(reminder.getCreatedAt()).isEqualTo(reminder.getUpdatedAt());
    }

    @Test
    void update하면_title이_변경되고_updatedAt이_갱신된다() throws Exception {
        Reminder reminder = new Reminder("장보기");
        var originalUpdatedAt = reminder.getUpdatedAt();

        Thread.sleep(10);

        reminder.update("운동하기");

        assertThat(reminder.getTitle()).isEqualTo("운동하기");
        assertThat(reminder.getUpdatedAt()).isAfter(originalUpdatedAt);
    }

    @Test
    void toggleComplete하면_completed_상태가_반전된다() {
        Reminder reminder = new Reminder("장보기");
        assertThat(reminder.isCompleted()).isFalse();

        reminder.toggleComplete();
        assertThat(reminder.isCompleted()).isTrue();

        reminder.toggleComplete();
        assertThat(reminder.isCompleted()).isFalse();
    }
}