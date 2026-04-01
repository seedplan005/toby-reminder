package ai.toby.reminder.service;

import ai.toby.reminder.domain.Priority;

import java.time.LocalDate;

public record ReminderFilter(
        Long listId,
        Boolean completed,
        Boolean flagged,
        LocalDate dueDate,
        LocalDate dueBefore,
        Priority priority
) {
    public static ReminderFilter empty() {
        return new ReminderFilter(null, null, null, null, null, null);
    }
}
