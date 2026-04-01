"use client";

import { useState, useEffect } from "react";
import type { Reminder, ReminderList } from "@/types";
import { updateReminder, toggleFlag } from "@/lib/api";

interface Props {
  reminder: Reminder;
  lists: ReminderList[];
  onUpdate: (updated: Reminder) => void;
  onClose: () => void;
}

const PRIORITY_OPTIONS: Array<{ value: Reminder["priority"]; label: string }> = [
  { value: "NONE", label: "없음" },
  { value: "LOW", label: "낮음" },
  { value: "MEDIUM", label: "중간" },
  { value: "HIGH", label: "높음" },
];

export default function ReminderDetail({ reminder, lists, onUpdate, onClose }: Props) {
  const [title, setTitle] = useState(reminder.title);
  const [notes, setNotes] = useState(reminder.notes ?? "");
  const [dueDate, setDueDate] = useState(reminder.dueDate ?? "");
  const [dueTime, setDueTime] = useState(reminder.dueTime ?? "");
  const [priority, setPriority] = useState(reminder.priority);

  // Sync when reminder changes
  useEffect(() => {
    setTitle(reminder.title);
    setNotes(reminder.notes ?? "");
    setDueDate(reminder.dueDate ?? "");
    setDueTime(reminder.dueTime ?? "");
    setPriority(reminder.priority);
  }, [reminder.id]);

  const handleSave = async () => {
    if (!title.trim()) return;
    try {
      const updated = await updateReminder(reminder.id, {
        title: title.trim(),
        notes: notes || null,
        dueDate: dueDate || null,
        dueTime: dueTime || null,
        priority,
      });
      onUpdate(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleFlag = async () => {
    try {
      const updated = await toggleFlag(reminder.id);
      onUpdate(updated);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      style={{
        width: 280,
        flexShrink: 0,
        background: "var(--surface)",
        borderLeft: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 16px 12px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
          세부 정보
        </span>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
            fontSize: 20,
            lineHeight: 1,
            padding: 0,
          }}
          aria-label="닫기"
        >
          ×
        </button>
      </div>

      {/* Fields */}
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {/* Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          style={{
            width: "100%",
            fontSize: 17,
            fontWeight: 600,
            marginBottom: 12,
            padding: "8px 0",
            borderBottom: "1px solid var(--border)",
          }}
        />

        {/* Notes */}
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={handleSave}
          placeholder="메모"
          rows={3}
          style={{
            width: "100%",
            fontSize: 15,
            resize: "none",
            marginBottom: 16,
            color: "var(--text-primary)",
            background: "transparent",
            border: "none",
            outline: "none",
            fontFamily: "inherit",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Due Date */}
          <DetailRow label="마감일">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              onBlur={handleSave}
              style={{ fontSize: 14, color: "var(--text-primary)", background: "transparent" }}
            />
          </DetailRow>

          {/* Due Time */}
          <DetailRow label="시간">
            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              onBlur={handleSave}
              style={{ fontSize: 14, color: "var(--text-primary)", background: "transparent" }}
            />
          </DetailRow>

          {/* Priority */}
          <DetailRow label="우선순위">
            <div style={{ display: "flex", gap: 4 }}>
              {PRIORITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={async () => {
                    setPriority(opt.value);
                    try {
                      const updated = await updateReminder(reminder.id, {
                        title: title.trim(),
                        notes: notes || null,
                        dueDate: dueDate || null,
                        dueTime: dueTime || null,
                        priority: opt.value,
                      });
                      onUpdate(updated);
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  style={{
                    padding: "3px 8px",
                    borderRadius: 6,
                    border: "1px solid var(--border)",
                    background: priority === opt.value ? "var(--accent-blue)" : "transparent",
                    color: priority === opt.value ? "white" : "var(--text-primary)",
                    fontSize: 12,
                    cursor: "pointer",
                    fontWeight: priority === opt.value ? 600 : 400,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </DetailRow>

          {/* Flag */}
          <DetailRow label="깃발">
            <button
              onClick={handleToggleFlag}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: 20,
                opacity: reminder.flagged ? 1 : 0.3,
                padding: 0,
              }}
              aria-label={reminder.flagged ? "깃발 해제" : "깃발 설정"}
            >
              🚩
            </button>
          </DetailRow>

          {/* List info */}
          {reminder.listId && (
            <DetailRow label="리스트">
              <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                {lists.find((l) => l.id === reminder.listId)?.name ?? "알 수 없음"}
              </span>
            </DetailRow>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <span style={{ fontSize: 14, color: "var(--text-secondary)", minWidth: 60 }}>{label}</span>
      <div>{children}</div>
    </div>
  );
}
