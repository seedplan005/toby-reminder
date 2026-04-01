package ai.toby.reminder.service.port.input;

import ai.toby.reminder.domain.ReminderList;

import java.util.List;
import java.util.Map;

public interface ReminderListService {

    List<ReminderList> findAll();

    ReminderList findById(Long id);

    ReminderList create(String name, String color, String icon);

    ReminderList update(Long id, String name, String color, String icon);

    void delete(Long id);

    Map<Long, Long> getIncompleteCountMap();
}
