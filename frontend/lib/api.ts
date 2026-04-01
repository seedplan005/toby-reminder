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
export const getReminders = (
  params?: {
    listId?: number | null;
    completed?: boolean;
    flagged?: boolean;
    dueDate?: string;
    dueBefore?: string;
    priority?: string;
  }
): Promise<Reminder[]> => {
  const q = new URLSearchParams();
  if (params?.listId != null) q.set("listId", String(params.listId));
  if (params?.completed != null) q.set("completed", String(params.completed));
  if (params?.flagged != null) q.set("flagged", String(params.flagged));
  if (params?.dueDate) q.set("dueDate", params.dueDate);
  if (params?.dueBefore) q.set("dueBefore", params.dueBefore);
  if (params?.priority) q.set("priority", params.priority);
  const qs = q.toString();
  return request(`/reminders${qs ? "?" + qs : ""}`);
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
