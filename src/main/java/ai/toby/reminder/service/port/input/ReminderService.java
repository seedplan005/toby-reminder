package ai.toby.reminder.service.port.input;

import ai.toby.reminder.domain.Reminder;

import java.util.List;

public interface ReminderService {

    List<Reminder> findAll();

    List<Reminder> findAllByListId(Long listId);

    Reminder findById(Long id);

    Reminder create(String title);

    Reminder create(String title, Long listId);

    Reminder update(Long id, String title);

    void delete(Long id);

    Reminder toggleComplete(Long id);
}
