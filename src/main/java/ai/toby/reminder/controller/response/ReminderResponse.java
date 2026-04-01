package ai.toby.reminder.controller.response;

import ai.toby.reminder.domain.Priority;
import ai.toby.reminder.domain.Reminder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record ReminderResponse(
        Long id,
        String title,
        boolean completed,
        Long listId,
        String notes,
        LocalDate dueDate,
        LocalTime dueTime,
        Priority priority,
        boolean flagged,
        Integer displayOrder,
        LocalDateTime completedAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ReminderResponse from(Reminder reminder) {
        return new ReminderResponse(
                reminder.getId(),
                reminder.getTitle(),
                reminder.isCompleted(),
                reminder.getList() != null ? reminder.getList().getId() : null,
                reminder.getNotes(),
                reminder.getDueDate(),
                reminder.getDueTime(),
                reminder.getPriority(),
                reminder.isFlagged(),
                reminder.getDisplayOrder(),
                reminder.getCompletedAt(),
                reminder.getCreatedAt(),
                reminder.getUpdatedAt()
        );
    }
}
