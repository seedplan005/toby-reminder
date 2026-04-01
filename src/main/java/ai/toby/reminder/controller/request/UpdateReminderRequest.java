package ai.toby.reminder.controller.request;

import jakarta.validation.constraints.NotBlank;

public record UpdateReminderRequest(
        @NotBlank String title
) {}
