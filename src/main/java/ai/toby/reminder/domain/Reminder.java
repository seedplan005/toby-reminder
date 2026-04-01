package ai.toby.reminder.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

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

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Reminder(String title) {
        this.title = title;
        this.completed = false;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    public Reminder(String title, ReminderList list) {
        this(title);
        this.list = list;
    }

    public void update(String title) {
        this.title = title;
        this.updatedAt = LocalDateTime.now();
    }

    public void toggleComplete() {
        this.completed = !this.completed;
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
}
