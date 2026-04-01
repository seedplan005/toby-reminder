export interface Reminder {
  id: number;
  title: string;
  completed: boolean;
  listId: number | null;
  notes: string | null;
  dueDate: string | null;
  dueTime: string | null;
  priority: "NONE" | "LOW" | "MEDIUM" | "HIGH";
  flagged: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReminderList {
  id: number;
  name: string;
  color: string;
  icon: string | null;
  displayOrder: number;
  reminderCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReminderCounts {
  today: number;
  scheduled: number;
  all: number;
  flagged: number;
  completed: number;
}
