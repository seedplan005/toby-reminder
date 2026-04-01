"use client";

import { useState, useEffect, useRef } from "react";
import type { Reminder } from "@/types";
import {
  getReminders,
  createReminder,
  deleteReminder,
  toggleComplete,
} from "@/lib/api";

export default function HomePage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [fadingIds, setFadingIds] = useState<Set<number>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getReminders().then(setReminders).catch(console.error);
  }, []);

  const handleAdd = async () => {
    const title = newTitle.trim();
    if (!title) return;
    try {
      const created = await createReminder(title);
      setReminders((prev) => [...prev, created]);
      setNewTitle("");
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggle = async (id: number) => {
    const reminder = reminders.find((r) => r.id === id);
    if (!reminder) return;

    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );

    if (!reminder.completed) {
      setFadingIds((prev) => new Set(prev).add(id));
      setTimeout(() => {
        setFadingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        setReminders((prev) => prev.filter((r) => r.id !== id));
      }, 500);
    }

    try {
      await toggleComplete(id);
    } catch (e) {
      setReminders((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, completed: reminder.completed } : r
        )
      );
    }
  };

  const handleDelete = async (id: number) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    try {
      await deleteReminder(id);
    } catch (e) {
      console.error(e);
    }
  };

  // Keep fading items visible during animation
  const incomplete = reminders.filter(
    (r) => !r.completed || fadingIds.has(r.id)
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        justifyContent: "center",
        paddingTop: 60,
      }}
    >
      <div style={{ width: "100%", maxWidth: 600, padding: "0 16px" }}>
        <div style={{ marginBottom: 24 }}>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            리마인더
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              marginTop: 4,
            }}
          >
            {incomplete.length}개 남음
          </p>
        </div>

        <div
          style={{
            background: "var(--surface)",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          {incomplete.length === 0 && (
            <div
              style={{
                padding: "20px 16px",
                color: "var(--text-secondary)",
                fontSize: 14,
                textAlign: "center",
              }}
            >
              리마인더가 없습니다
            </div>
          )}

          {incomplete.map((reminder, idx) => (
            <ReminderRow
              key={reminder.id}
              reminder={reminder}
              fading={fadingIds.has(reminder.id)}
              showDivider={idx < incomplete.length - 1}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              borderTop:
                incomplete.length > 0 ? "1px solid var(--border)" : undefined,
            }}
          >
            <button
              onClick={() => inputRef.current?.focus()}
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                border: "2px solid var(--accent-blue)",
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
  onToggle,
  onDelete,
}: {
  reminder: Reminder;
  fading: boolean;
  showDivider: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
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
      }}
    >
      <button
        onClick={() => onToggle(reminder.id)}
        className={`reminder-check${reminder.completed ? " checked" : ""}`}
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
          onClick={() => onDelete(reminder.id)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 4,
            color: "var(--text-secondary)",
            fontSize: 18,
            lineHeight: 1,
            borderRadius: 4,
          }}
          aria-label="삭제"
        >
          ×
        </button>
      )}
    </div>
  );
}
