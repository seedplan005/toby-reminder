package ai.toby.reminder.controller.response;

import ai.toby.reminder.domain.ReminderList;

import java.time.LocalDateTime;

public record ReminderListResponse(
        Long id,
        String name,
        String color,
        String icon,
        Integer displayOrder,
        long reminderCount,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ReminderListResponse from(ReminderList list, long count) {
        return new ReminderListResponse(
                list.getId(),
                list.getName(),
                list.getColor(),
                list.getIcon(),
                list.getDisplayOrder(),
                count,
                list.getCreatedAt(),
                list.getUpdatedAt()
        );
    }
}
