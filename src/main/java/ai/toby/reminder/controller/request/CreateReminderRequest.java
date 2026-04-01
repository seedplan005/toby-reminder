package ai.toby.reminder.controller.request;

import jakarta.validation.constraints.NotBlank;

public record CreateReminderRequest(
        @NotBlank String title,
        Long listId
) {}
