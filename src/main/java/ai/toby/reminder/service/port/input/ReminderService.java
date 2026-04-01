package ai.toby.reminder.service.port.input;

import ai.toby.reminder.domain.Reminder;

import java.util.List;

public interface ReminderService {

    List<Reminder> findAll();

    Reminder findById(Long id);

    Reminder create(String title);

    Reminder update(Long id, String title);

    void delete(Long id);

    Reminder toggleComplete(Long id);
}
