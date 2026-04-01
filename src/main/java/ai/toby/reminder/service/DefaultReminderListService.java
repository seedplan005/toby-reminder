package ai.toby.reminder.service;

import ai.toby.reminder.domain.ReminderList;
import ai.toby.reminder.domain.ReminderListRepository;
import ai.toby.reminder.domain.ReminderRepository;
import ai.toby.reminder.service.port.input.ReminderListService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DefaultReminderListService implements ReminderListService {

    private final ReminderListRepository reminderListRepository;
    private final ReminderRepository reminderRepository;

    @Override
    public List<ReminderList> findAll() {
        return reminderListRepository.findAllByOrderByDisplayOrderAsc();
    }

    @Override
    public ReminderList findById(Long id) {
        return reminderListRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("ReminderList not found: " + id));
    }

    @Override
    @Transactional
    public ReminderList create(String name, String color, String icon) {
        int nextOrder = (int) reminderListRepository.count();
        return reminderListRepository.save(new ReminderList(name, color, icon, nextOrder));
    }

    @Override
    @Transactional
    public ReminderList update(Long id, String name, String color, String icon) {
        ReminderList list = findById(id);
        list.update(name, color, icon);
        return list;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        ReminderList list = findById(id);
        reminderRepository.detachList(list);
        reminderListRepository.delete(list);
    }

    @Override
    @Transactional
    public void reorder(List<Long> orderedIds) {
        for (int i = 0; i < orderedIds.size(); i++) {
            reminderListRepository.updateDisplayOrder(orderedIds.get(i), i);
        }
    }

    @Override
    public Map<Long, Long> getIncompleteCountMap() {
        List<Object[]> rows = reminderRepository.countIncompleteGroupByListId();
        Map<Long, Long> result = new HashMap<>();
        for (Object[] row : rows) {
            result.put((Long) row[0], (Long) row[1]);
        }
        return result;
    }
}
