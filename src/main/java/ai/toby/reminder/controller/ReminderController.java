package ai.toby.reminder.controller;

import ai.toby.reminder.controller.request.CreateReminderRequest;
import ai.toby.reminder.controller.request.UpdateReminderRequest;
import ai.toby.reminder.controller.response.ReminderResponse;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
@RequiredArgsConstructor
public class ReminderController {

    private final ReminderService reminderService;

    @GetMapping
    public List<ReminderResponse> findAll() {
        return reminderService.findAll().stream()
                .map(ReminderResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public ReminderResponse findById(@PathVariable Long id) {
        return ReminderResponse.from(reminderService.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReminderResponse create(@RequestBody @Valid CreateReminderRequest request) {
        return ReminderResponse.from(reminderService.create(request.title()));
    }

    @PutMapping("/{id}")
    public ReminderResponse update(@PathVariable Long id,
                                   @RequestBody @Valid UpdateReminderRequest request) {
        return ReminderResponse.from(reminderService.update(id, request.title()));
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
}
