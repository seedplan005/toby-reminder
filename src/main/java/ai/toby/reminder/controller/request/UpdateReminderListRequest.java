package ai.toby.reminder.controller.request;

import jakarta.validation.constraints.NotBlank;

public record UpdateReminderListRequest(
        @NotBlank String name,
        String color,
        String icon
) {}
