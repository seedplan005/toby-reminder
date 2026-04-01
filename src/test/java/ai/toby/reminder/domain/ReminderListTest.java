package ai.toby.reminder.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ReminderListTest {

    @Test
    @DisplayName("생성자로 만들면 필드가 설정되고 createdAt과 updatedAt이 동일하게 설정된다")
    void createWithNameColorIcon() {
        ReminderList list = new ReminderList("업무", "#007AFF", "briefcase.fill", 0);

        assertThat(list.getName()).isEqualTo("업무");
        assertThat(list.getColor()).isEqualTo("#007AFF");
        assertThat(list.getIcon()).isEqualTo("briefcase.fill");
        assertThat(list.getDisplayOrder()).isEqualTo(0);
        assertThat(list.getCreatedAt()).isNotNull();
        assertThat(list.getUpdatedAt()).isEqualTo(list.getCreatedAt());
    }

    @Test
    @DisplayName("update하면 name, color, icon이 변경되고 updatedAt이 갱신된다")
    void updateChangesFields() throws Exception {
        ReminderList list = new ReminderList("업무", "#007AFF", "briefcase.fill", 0);
        var originalUpdatedAt = list.getUpdatedAt();

        Thread.sleep(10);

        list.update("개인", "#34C759", "person.fill");

        assertThat(list.getName()).isEqualTo("개인");
        assertThat(list.getColor()).isEqualTo("#34C759");
        assertThat(list.getIcon()).isEqualTo("person.fill");
        assertThat(list.getUpdatedAt()).isAfter(originalUpdatedAt);
    }
}
