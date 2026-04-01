package ai.toby.reminder.controller.response;

import ai.toby.reminder.service.ReminderCounts;

public record ReminderCountsResponse(
        long today,
        long scheduled,
        long all,
        long flagged,
        long completed
) {
    public static ReminderCountsResponse from(ReminderCounts counts) {
        return new ReminderCountsResponse(
                counts.today(),
                counts.scheduled(),
                counts.all(),
                counts.flagged(),
                counts.completed()
        );
    }
}
