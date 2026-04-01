package ai.toby.reminder.controller;

import ai.toby.reminder.controller.request.CreateReminderListRequest;
import ai.toby.reminder.controller.request.ReorderRequest;
import ai.toby.reminder.controller.request.UpdateReminderListRequest;
import ai.toby.reminder.controller.response.ReminderListResponse;
import ai.toby.reminder.service.port.input.ReminderListService;
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
import java.util.Map;

@RestController
@RequestMapping("/api/lists")
@RequiredArgsConstructor
public class ReminderListController {

    private final ReminderListService reminderListService;

    @GetMapping
    public List<ReminderListResponse> findAll() {
        Map<Long, Long> countMap = reminderListService.getIncompleteCountMap();
        return reminderListService.findAll().stream()
                .map(list -> ReminderListResponse.from(list, countMap.getOrDefault(list.getId(), 0L)))
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReminderListResponse create(@RequestBody @Valid CreateReminderListRequest request) {
        return ReminderListResponse.from(
                reminderListService.create(request.name(), request.color(), request.icon()), 0L);
    }

    @PutMapping("/{id}")
    public ReminderListResponse update(@PathVariable Long id,
                                       @RequestBody @Valid UpdateReminderListRequest request) {
        Map<Long, Long> countMap = reminderListService.getIncompleteCountMap();
        var updated = reminderListService.update(id, request.name(), request.color(), request.icon());
        return ReminderListResponse.from(updated, countMap.getOrDefault(id, 0L));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        reminderListService.delete(id);
    }

    @PatchMapping("/reorder")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reorder(@RequestBody @Valid ReorderRequest request) {
        reminderListService.reorder(request.orderedIds());
    }
}
