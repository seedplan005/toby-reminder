package ai.toby.reminder.service;

import ai.toby.reminder.domain.Reminder;
import ai.toby.reminder.domain.ReminderRepository;
import ai.toby.reminder.service.port.input.ReminderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DefaultReminderService implements ReminderService {

    private final ReminderRepository reminderRepository;

    @Override
    public List<Reminder> findAll() {
        return reminderRepository.findAll();
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
    public Reminder update(Long id, String title) {
        Reminder reminder = findById(id);
        reminder.update(title);
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
}
