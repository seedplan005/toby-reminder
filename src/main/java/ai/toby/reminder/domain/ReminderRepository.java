package ai.toby.reminder.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {

    @Query("SELECT r FROM Reminder r LEFT JOIN FETCH r.list")
    List<Reminder> findAllWithList();

    @Query("SELECT r FROM Reminder r LEFT JOIN FETCH r.list WHERE r.list.id = :listId")
    List<Reminder> findAllByListIdWithList(@Param("listId") Long listId);

    @Query("SELECT r FROM Reminder r LEFT JOIN FETCH r.list WHERE r.completed = false")
    List<Reminder> findAllIncompleteWithList();

    @Query("SELECT r FROM Reminder r LEFT JOIN FETCH r.list WHERE r.completed = true")
    List<Reminder> findAllCompletedWithList();

    @Query("SELECT r FROM Reminder r LEFT JOIN FETCH r.list WHERE r.flagged = true AND r.completed = false")
    List<Reminder> findAllFlaggedIncompleteWithList();

    @Query("SELECT r FROM Reminder r LEFT JOIN FETCH r.list WHERE r.dueDate = :date AND r.completed = false")
    List<Reminder> findAllDueTodayWithList(@Param("date") LocalDate date);

    @Query("SELECT r FROM Reminder r LEFT JOIN FETCH r.list WHERE r.dueDate >= :from AND r.completed = false")
    List<Reminder> findAllScheduledFromWithList(@Param("from") LocalDate from);

    @Query("SELECT r.list.id, COUNT(r) FROM Reminder r WHERE r.list IS NOT NULL AND r.completed = false GROUP BY r.list.id")
    List<Object[]> countIncompleteGroupByListId();

    @Query("SELECT COUNT(r) FROM Reminder r WHERE r.completed = false AND r.dueDate = :date")
    long countTodayIncomplete(@Param("date") LocalDate date);

    @Query("SELECT COUNT(r) FROM Reminder r WHERE r.completed = false AND r.dueDate >= :from")
    long countScheduledFrom(@Param("from") LocalDate from);

    @Query("SELECT COUNT(r) FROM Reminder r WHERE r.completed = false")
    long countAllIncomplete();

    @Query("SELECT COUNT(r) FROM Reminder r WHERE r.flagged = true AND r.completed = false")
    long countFlaggedIncomplete();

    @Query("SELECT COUNT(r) FROM Reminder r WHERE r.completed = true")
    long countCompleted();

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Reminder r SET r.list = null, r.updatedAt = CURRENT_TIMESTAMP WHERE r.list = :list")
    void detachList(@Param("list") ReminderList list);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Reminder r SET r.displayOrder = :order, r.updatedAt = CURRENT_TIMESTAMP WHERE r.id = :id")
    void updateDisplayOrder(@Param("id") Long id, @Param("order") int order);
}
