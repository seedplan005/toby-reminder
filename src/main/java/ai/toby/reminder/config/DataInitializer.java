package ai.toby.reminder.config;

import ai.toby.reminder.domain.ReminderList;
import ai.toby.reminder.domain.ReminderListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final ReminderListRepository reminderListRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (reminderListRepository.count() == 0) {
            reminderListRepository.save(new ReminderList("오늘", "#FF3B30", "sun.max.fill", 0));
            reminderListRepository.save(new ReminderList("업무", "#007AFF", "briefcase.fill", 1));
            reminderListRepository.save(new ReminderList("개인", "#34C759", "person.fill", 2));
        }
    }
}
