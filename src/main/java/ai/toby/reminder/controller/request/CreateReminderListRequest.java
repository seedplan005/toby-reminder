package ai.toby.reminder.controller.request;

import jakarta.validation.constraints.NotBlank;

public record CreateReminderListRequest(
        @NotBlank String name,
        String color,
        String icon
) {}
