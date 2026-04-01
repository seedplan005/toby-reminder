package ai.toby.reminder.controller.request;

import ai.toby.reminder.domain.Priority;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;
import java.time.LocalTime;

public record UpdateReminderRequest(
        @NotBlank String title,
        String notes,
        LocalDate dueDate,
        LocalTime dueTime,
        Priority priority
) {}
