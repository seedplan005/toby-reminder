import type { Reminder, ReminderList, ReminderCounts } from "@/types";

const BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// Reminders
export const getReminders = (listId?: number | null): Promise<Reminder[]> => {
  const query = listId != null ? `?listId=${listId}` : "";
  return request(`/reminders${query}`);
};

export const createReminder = (
  title: string,
  listId?: number | null
): Promise<Reminder> =>
  request("/reminders", {
    method: "POST",
    body: JSON.stringify({ title, listId: listId ?? null }),
  });

export const updateReminder = (
  id: number,
  data: Partial<{
    title: string;
    notes: string | null;
    dueDate: string | null;
    dueTime: string | null;
    priority: string;
  }>
): Promise<Reminder> =>
  request(`/reminders/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteReminder = (id: number): Promise<void> =>
  request(`/reminders/${id}`, { method: "DELETE" });

export const toggleComplete = (id: number): Promise<Reminder> =>
  request(`/reminders/${id}/complete`, { method: "PATCH" });

export const toggleFlag = (id: number): Promise<Reminder> =>
  request(`/reminders/${id}/flag`, { method: "PATCH" });

export const reorderReminders = (orderedIds: number[]): Promise<void> =>
  request("/reminders/reorder", {
    method: "PATCH",
    body: JSON.stringify({ orderedIds }),
  });

export const getReminderCounts = (): Promise<ReminderCounts> =>
  request("/reminders/counts");

// Lists
export const getLists = (): Promise<ReminderList[]> => request("/lists");

export const createList = (
  name: string,
  color: string,
  icon?: string | null
): Promise<ReminderList> =>
  request("/lists", {
    method: "POST",
    body: JSON.stringify({ name, color, icon: icon ?? null }),
  });

export const updateList = (
  id: number,
  name: string,
  color: string,
  icon?: string | null
): Promise<ReminderList> =>
  request(`/lists/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name, color, icon: icon ?? null }),
  });

export const deleteList = (id: number): Promise<void> =>
  request(`/lists/${id}`, { method: "DELETE" });

export const reorderLists = (orderedIds: number[]): Promise<void> =>
  request("/lists/reorder", {
    method: "PATCH",
    body: JSON.stringify({ orderedIds }),
  });
