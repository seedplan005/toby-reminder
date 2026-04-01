package ai.toby.reminder.controller;

import ai.toby.reminder.controller.request.CreateReminderRequest;
import ai.toby.reminder.controller.request.ReorderRequest;
import ai.toby.reminder.controller.request.UpdateReminderRequest;
import ai.toby.reminder.controller.response.ReminderCountsResponse;
import ai.toby.reminder.controller.response.ReminderResponse;
import ai.toby.reminder.domain.Priority;
import ai.toby.reminder.service.ReminderFilter;
import ai.toby.reminder.service.port.input.ReminderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reminders")
@RequiredArgsConstructor
public class ReminderController {

    private final ReminderService reminderService;

    @GetMapping
    public List<ReminderResponse> findAll(
            @RequestParam(required = false) Long listId,
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false) Boolean flagged,
            @RequestParam(required = false) LocalDate dueDate,
            @RequestParam(required = false) LocalDate dueBefore,
            @RequestParam(required = false) Priority priority
    ) {
        ReminderFilter filter = new ReminderFilter(listId, completed, flagged, dueDate, dueBefore, priority);
        return reminderService.findAllByFilter(filter).stream()
                .map(ReminderResponse::from)
                .toList();
    }

    @GetMapping("/counts")
    public ReminderCountsResponse getCounts() {
        return ReminderCountsResponse.from(reminderService.getCounts());
    }

    @GetMapping("/{id}")
    public ReminderResponse findById(@PathVariable Long id) {
        return ReminderResponse.from(reminderService.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReminderResponse create(@RequestBody @Valid CreateReminderRequest request) {
        var reminder = (request.listId() != null)
                ? reminderService.create(request.title(), request.listId())
                : reminderService.create(request.title());
        return ReminderResponse.from(reminder);
    }

    @PutMapping("/{id}")
    public ReminderResponse update(@PathVariable Long id,
                                   @RequestBody @Valid UpdateReminderRequest request) {
        return ReminderResponse.from(reminderService.update(
                id,
                request.title(),
                request.notes(),
                request.dueDate(),
                request.dueTime(),
                request.priority()
        ));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        reminderService.delete(id);
    }

    @PatchMapping("/{id}/complete")
    public ReminderResponse toggleComplete(@PathVariable Long id) {
        return ReminderResponse.from(reminderService.toggleComplete(id));
    }

    @PatchMapping("/{id}/flag")
    public ReminderResponse toggleFlag(@PathVariable Long id) {
        return ReminderResponse.from(reminderService.toggleFlag(id));
    }

    @PatchMapping("/reorder")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reorder(@RequestBody @Valid ReorderRequest request) {
        reminderService.reorder(request.orderedIds());
    }
}
