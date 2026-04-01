package ai.toby.reminder.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Reminder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private boolean completed;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "list_id")
    private ReminderList list;

    private String notes;

    private LocalDate dueDate;

    private LocalTime dueTime;

    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.NONE;

    private boolean flagged;

    private Integer displayOrder;

    private LocalDateTime completedAt;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Reminder(String title) {
        this.title = title;
        this.completed = false;
        this.priority = Priority.NONE;
        this.flagged = false;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    public Reminder(String title, ReminderList list) {
        this(title);
        this.list = list;
    }

    public void update(String title, String notes, LocalDate dueDate, LocalTime dueTime, Priority priority) {
        this.title = title;
        this.notes = notes;
        this.dueDate = dueDate;
        this.dueTime = dueTime;
        this.priority = priority != null ? priority : Priority.NONE;
        this.updatedAt = LocalDateTime.now();
    }

    public void toggleComplete() {
        this.completed = !this.completed;
        this.completedAt = this.completed ? LocalDateTime.now() : null;
        this.updatedAt = LocalDateTime.now();
    }

    public void toggleFlag() {
        this.flagged = !this.flagged;
        this.updatedAt = LocalDateTime.now();
    }

    public void assignList(ReminderList list) {
        this.list = list;
        this.updatedAt = LocalDateTime.now();
    }

    public void removeList() {
        this.list = null;
        this.updatedAt = LocalDateTime.now();
    }

    public void setDisplayOrder(int order) {
        this.displayOrder = order;
        this.updatedAt = LocalDateTime.now();
    }
}
