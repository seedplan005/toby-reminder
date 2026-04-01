"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Reminder, ReminderList } from "@/types";
import {
  getReminders,
  createReminder,
  deleteReminder,
  toggleComplete,
  updateReminder,
} from "@/lib/api";
import { useApp } from "@/context/AppContext";

interface Props {
  listId?: number | null;
  listColor?: string;
  title: string;
  onReminderCountChange?: () => void;
}

export default function ReminderListView({
  listId,
  listColor,
  title,
  onReminderCountChange,
}: Props) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [fadingIds, setFadingIds] = useState<Set<number>>(new Set());
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const data = await getReminders(listId);
      setReminders(data.filter((r) => !r.completed));
    } catch (e) {
      console.error(e);
    }
  }, [listId]);

  useEffect(() => {
    load();
    setSelectedId(null);
  }, [load]);

  const handleAdd = async () => {
    const t = newTitle.trim();
    if (!t) return;
    try {
      const created = await createReminder(t, listId);
      setReminders((prev) => [...prev, created]);
      setNewTitle("");
      onReminderCountChange?.();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggle = async (id: number) => {
    const reminder = reminders.find((r) => r.id === id);
    if (!reminder || reminder.completed) return;

    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: true } : r))
    );
    setFadingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setFadingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setReminders((prev) => prev.filter((r) => r.id !== id));
      onReminderCountChange?.();
    }, 500);

    try {
      await toggleComplete(id);
    } catch (e) {
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, completed: false } : r))
      );
    }
  };

  const handleDelete = async (id: number) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    if (selectedId === id) setSelectedId(null);
    try {
      await deleteReminder(id);
      onReminderCountChange?.();
    } catch (e) {
      console.error(e);
    }
  };

  const checkColor = listColor ?? "var(--accent-green)";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div
        style={{
          padding: "32px 24px 16px",
          flexShrink: 0,
        }}
      >
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: listColor ?? "var(--text-primary)",
            margin: 0,
          }}
        >
          {title}
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
          {reminders.filter((r) => !r.completed).length}개 남음
        </p>
      </div>

      {/* List */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 24px 24px",
        }}
      >
        <div
          style={{
            background: "var(--surface)",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          {reminders
            .filter((r) => !r.completed || fadingIds.has(r.id))
            .map((reminder, idx, arr) => (
              <ReminderRow
                key={reminder.id}
                reminder={reminder}
                fading={fadingIds.has(reminder.id)}
                showDivider={idx < arr.length - 1}
                checkColor={checkColor}
                selected={selectedId === reminder.id}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onSelect={(id) =>
                  setSelectedId((prev) => (prev === id ? null : id))
                }
              />
            ))}

          {/* Inline add */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              borderTop:
                reminders.length > 0 ? "1px solid var(--border)" : undefined,
            }}
          >
            <button
              onClick={() => inputRef.current?.focus()}
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                border: `2px solid var(--accent-blue)`,
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                flexShrink: 0,
              }}
              aria-label="새 리마인더 추가"
            >
              <span
                style={{
                  color: "var(--accent-blue)",
                  fontSize: 16,
                  lineHeight: 1,
                  marginTop: -1,
                }}
              >
                +
              </span>
            </button>
            <input
              ref={inputRef}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
              }}
              placeholder="새로운 리마인더"
              style={{
                flex: 1,
                fontSize: 16,
                color: "var(--text-primary)",
                background: "transparent",
                border: "none",
                outline: "none",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ReminderRow({
  reminder,
  fading,
  showDivider,
  checkColor,
  selected,
  onToggle,
  onDelete,
  onSelect,
}: {
  reminder: Reminder;
  fading: boolean;
  showDivider: boolean;
  checkColor: string;
  selected: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onSelect: (id: number) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={fading ? "reminder-fade-out" : ""}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        borderBottom: showDivider ? "1px solid var(--border)" : undefined,
        background: hovered ? "var(--surface-hover)" : "var(--surface)",
        transition: "background 0.1s ease",
        cursor: "pointer",
      }}
      onClick={() => onSelect(reminder.id)}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(reminder.id);
        }}
        className={`reminder-check${reminder.completed ? " checked" : ""}`}
        style={
          !reminder.completed
            ? { borderColor: checkColor }
            : { backgroundColor: checkColor, borderColor: checkColor }
        }
        aria-label={reminder.completed ? "완료 취소" : "완료"}
      >
        {reminder.completed && (
          <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
            <path
              d="M1 4L4.5 7.5L11 1"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      <span
        style={{
          flex: 1,
          fontSize: 16,
          color: reminder.completed
            ? "var(--text-secondary)"
            : "var(--text-primary)",
          textDecoration: reminder.completed ? "line-through" : "none",
        }}
      >
        {reminder.title}
      </span>

      {hovered && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(reminder.id);
          }}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 4,
            color: "var(--text-secondary)",
            fontSize: 18,
            lineHeight: 1,
          }}
          aria-label="삭제"
        >
          ×
        </button>
      )}
    </div>
  );
}
