package ai.toby.reminder.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReminderListRepository extends JpaRepository<ReminderList, Long> {

    List<ReminderList> findAllByOrderByDisplayOrderAsc();

    @Modifying(clearAutomatically = true)
    @Query("UPDATE ReminderList l SET l.displayOrder = :order, l.updatedAt = CURRENT_TIMESTAMP WHERE l.id = :id")
    void updateDisplayOrder(@Param("id") Long id, @Param("order") int order);
}
