package ai.toby.reminder.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReminderListRepository extends JpaRepository<ReminderList, Long> {

    List<ReminderList> findAllByOrderByDisplayOrderAsc();
}
