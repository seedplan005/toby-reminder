package ai.toby.reminder.service;

public record ReminderCounts(
        long today,
        long scheduled,
        long all,
        long flagged,
        long completed
) {}
