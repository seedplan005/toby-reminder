package ai.toby.reminder.service.port.input;

import ai.toby.reminder.domain.Priority;
import ai.toby.reminder.domain.Reminder;
import ai.toby.reminder.service.ReminderCounts;
import ai.toby.reminder.service.ReminderFilter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReminderService {

    List<Reminder> findAll();

    List<Reminder> findAllByListId(Long listId);

    List<Reminder> findAllByFilter(ReminderFilter filter);

    Reminder findById(Long id);

    Reminder create(String title);

    Reminder create(String title, Long listId);

    Reminder update(Long id, String title, String notes, LocalDate dueDate, LocalTime dueTime, Priority priority);

    void delete(Long id);

    Reminder toggleComplete(Long id);

    Reminder toggleFlag(Long id);

    ReminderCounts getCounts();

    void reorder(java.util.List<Long> orderedIds);
}
