package ai.toby.reminder.service;

import ai.toby.reminder.domain.Priority;
import ai.toby.reminder.domain.Reminder;
import ai.toby.reminder.domain.ReminderList;
import ai.toby.reminder.domain.ReminderListRepository;
import ai.toby.reminder.domain.ReminderRepository;
import ai.toby.reminder.service.port.input.ReminderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DefaultReminderService implements ReminderService {

    private final ReminderRepository reminderRepository;
    private final ReminderListRepository reminderListRepository;

    @Override
    public List<Reminder> findAll() {
        return reminderRepository.findAllWithList();
    }

    @Override
    public List<Reminder> findAllByListId(Long listId) {
        if (!reminderListRepository.existsById(listId)) {
            throw new NoSuchElementException("ReminderList not found: " + listId);
        }
        return reminderRepository.findAllByListIdWithList(listId);
    }

    @Override
    public List<Reminder> findAllByFilter(ReminderFilter filter) {
        if (filter.listId() != null) {
            return findAllByListId(filter.listId());
        }
        if (Boolean.TRUE.equals(filter.completed())) {
            return reminderRepository.findAllCompletedWithList();
        }
        if (Boolean.TRUE.equals(filter.flagged())) {
            return reminderRepository.findAllFlaggedIncompleteWithList();
        }
        if (filter.dueDate() != null) {
            return reminderRepository.findAllDueTodayWithList(filter.dueDate());
        }
        if (filter.dueBefore() != null) {
            return reminderRepository.findAllScheduledFromWithList(LocalDate.now().plusDays(1));
        }
        if (Boolean.FALSE.equals(filter.completed())) {
            return reminderRepository.findAllIncompleteWithList();
        }
        return reminderRepository.findAllWithList();
    }

    @Override
    public Reminder findById(Long id) {
        return reminderRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Reminder not found: " + id));
    }

    @Override
    @Transactional
    public Reminder create(String title) {
        return reminderRepository.save(new Reminder(title));
    }

    @Override
    @Transactional
    public Reminder create(String title, Long listId) {
        ReminderList list = reminderListRepository.findById(listId)
                .orElseThrow(() -> new NoSuchElementException("ReminderList not found: " + listId));
        return reminderRepository.save(new Reminder(title, list));
    }

    @Override
    @Transactional
    public Reminder update(Long id, String title, String notes, LocalDate dueDate, LocalTime dueTime, Priority priority) {
        Reminder reminder = findById(id);
        reminder.update(title, notes, dueDate, dueTime, priority);
        return reminder;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Reminder reminder = findById(id);
        reminderRepository.delete(reminder);
    }

    @Override
    @Transactional
    public Reminder toggleComplete(Long id) {
        Reminder reminder = findById(id);
        reminder.toggleComplete();
        return reminder;
    }

    @Override
    @Transactional
    public Reminder toggleFlag(Long id) {
        Reminder reminder = findById(id);
        reminder.toggleFlag();
        return reminder;
    }

    @Override
    public ReminderCounts getCounts() {
        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);
        return new ReminderCounts(
                reminderRepository.countTodayIncomplete(today),
                reminderRepository.countScheduledFrom(tomorrow),
                reminderRepository.countAllIncomplete(),
                reminderRepository.countFlaggedIncomplete(),
                reminderRepository.countCompleted()
        );
    }

    @Override
    @Transactional
    public void reorder(List<Long> orderedIds) {
        for (int i = 0; i < orderedIds.size(); i++) {
            reminderRepository.updateDisplayOrder(orderedIds.get(i), i);
        }
    }
}
