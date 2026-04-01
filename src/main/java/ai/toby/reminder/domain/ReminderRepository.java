package ai.toby.reminder.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {

    @Query("SELECT r FROM Reminder r LEFT JOIN FETCH r.list")
    List<Reminder> findAllWithList();

    @Query("SELECT r FROM Reminder r LEFT JOIN FETCH r.list WHERE r.list.id = :listId")
    List<Reminder> findAllByListIdWithList(@Param("listId") Long listId);

    @Query("SELECT r.list.id, COUNT(r) FROM Reminder r WHERE r.list IS NOT NULL AND r.completed = false GROUP BY r.list.id")
    List<Object[]> countIncompleteGroupByListId();

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Reminder r SET r.list = null, r.updatedAt = CURRENT_TIMESTAMP WHERE r.list = :list")
    void detachList(@Param("list") ReminderList list);
}
