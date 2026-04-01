"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Reminder } from "@/types";
import { getReminders, createReminder, deleteReminder, toggleComplete, reorderReminders } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import ReminderDetail from "./ReminderDetail";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  listId?: number | null;
  filterParams?: Parameters<typeof getReminders>[0];
  listColor?: string;
  title: string;
  onReminderCountChange?: () => void;
}

export default function ReminderListView({
  listId,
  filterParams,
  listColor,
  title,
  onReminderCountChange,
}: Props) {
  const { lists } = useApp();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [fadingIds, setFadingIds] = useState<Set<number>>(new Set());
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const load = useCallback(async () => {
    try {
      const params = listId != null ? { ...filterParams, listId } : filterParams;
      const data = await getReminders(params);
      const showCompleted = filterParams?.completed === true;
      setReminders(showCompleted ? data : data.filter((r) => !r.completed));
    } catch (e) {
      console.error(e);
    }
  }, [listId, JSON.stringify(filterParams)]);

  useEffect(() => {
    load();
    setSelectedId(null);
  }, [load]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedId != null) {
          handleDelete(selectedId);
        }
      } else if (e.key === "Escape") {
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedId]);

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

    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, completed: true } : r)));
    setFadingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setFadingIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
      setReminders((prev) => prev.filter((r) => r.id !== id));
      if (selectedId === id) setSelectedId(null);
      onReminderCountChange?.();
    }, 500);

    try {
      await toggleComplete(id);
    } catch (e) {
      setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, completed: false } : r)));
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

  const handleReminderUpdate = (updated: Reminder) => {
    setReminders((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = visible.findIndex((r) => r.id === Number(active.id));
    const newIndex = visible.findIndex((r) => r.id === Number(over.id));
    const reordered = arrayMove(visible, oldIndex, newIndex);
    setReminders(reordered);

    try {
      await reorderReminders(reordered.map((r) => r.id));
    } catch (e) {
      console.error(e);
    }
  };

  const checkColor = listColor ?? "var(--accent-green)";
  const visible = reminders.filter((r) => !r.completed || fadingIds.has(r.id));
  const selectedReminder = selectedId != null ? reminders.find((r) => r.id === selectedId) ?? null : null;

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "32px 24px 16px", flexShrink: 0 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: listColor ?? "var(--text-primary)", margin: 0 }}>
            {title}
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
            {visible.filter((r) => !r.completed).length}개 남음
          </p>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 24px" }}>
          <div style={{ background: "var(--surface)", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext
                items={visible.map((r) => r.id)}
                strategy={verticalListSortingStrategy}
              >
                {visible.map((reminder, idx, arr) => (
                  <SortableReminderRow
                    key={reminder.id}
                    reminder={reminder}
                    fading={fadingIds.has(reminder.id)}
                    showDivider={idx < arr.length - 1}
                    checkColor={checkColor}
                    selected={selectedId === reminder.id}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onSelect={(id) => setSelectedId((prev) => (prev === id ? null : id))}
                  />
                ))}
              </SortableContext>
            </DndContext>

            {/* Inline add */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderTop: visible.length > 0 ? "1px solid var(--border)" : undefined }}>
              <button
                onClick={() => inputRef.current?.focus()}
                style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid var(--accent-blue)`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}
                aria-label="새 리마인더 추가"
              >
                <span style={{ color: "var(--accent-blue)", fontSize: 16, lineHeight: 1, marginTop: -1 }}>+</span>
              </button>
              <input
                ref={inputRef}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
                placeholder="새로운 리마인더 (N)"
                style={{ flex: 1, fontSize: 16 }}
              />
            </div>
          </div>
        </div>
      </div>

      {selectedReminder && (
        <ReminderDetail
          reminder={selectedReminder}
          lists={lists}
          onUpdate={handleReminderUpdate}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}

function SortableReminderRow(props: ReminderRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.reminder.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <ReminderRow {...props} dragListeners={listeners} />
    </div>
  );
}

interface ReminderRowProps {
  reminder: Reminder;
  fading: boolean;
  showDivider: boolean;
  checkColor: string;
  selected: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onSelect: (id: number) => void;
  dragListeners?: Record<string, unknown>;
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
  dragListeners,
}: ReminderRowProps) {
  const [hovered, setHovered] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const isPastDue = reminder.dueDate && reminder.dueDate < today;

  const priorityMark =
    reminder.priority === "HIGH" ? "!!!" :
    reminder.priority === "MEDIUM" ? "!!" :
    reminder.priority === "LOW" ? "!" : null;

  return (
    <div
      className={fading ? "reminder-fade-out" : ""}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "12px 16px",
        borderBottom: showDivider ? "1px solid var(--border)" : undefined,
        background: selected ? "rgba(0,122,255,0.06)" : hovered ? "var(--surface-hover)" : "var(--surface)",
        transition: "background 0.1s ease",
        cursor: "pointer",
      }}
      onClick={() => onSelect(reminder.id)}
    >
      {/* Drag handle */}
      {hovered && (
        <span
          {...(dragListeners as React.HTMLAttributes<HTMLSpanElement>)}
          style={{ cursor: "grab", color: "var(--text-secondary)", fontSize: 14, marginTop: 3, flexShrink: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          ⠿
        </span>
      )}

      <button
        onClick={(e) => { e.stopPropagation(); onToggle(reminder.id); }}
        className={`reminder-check${reminder.completed ? " checked" : ""}`}
        style={{
          marginTop: 1,
          ...(reminder.completed
            ? { backgroundColor: checkColor, borderColor: checkColor }
            : { borderColor: checkColor }),
        }}
        aria-label={reminder.completed ? "완료 취소" : "완료"}
      >
        {reminder.completed && (
          <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
            <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {!reminder.completed && priorityMark && (
          <span style={{ fontSize: 8, color: checkColor, fontWeight: 700, lineHeight: 1 }}>{priorityMark}</span>
        )}
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 16, color: reminder.completed ? "var(--text-secondary)" : "var(--text-primary)", textDecoration: reminder.completed ? "line-through" : "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {reminder.title}
          </span>
          {reminder.flagged && <span style={{ fontSize: 12 }}>🚩</span>}
        </div>
        {reminder.notes && (
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {reminder.notes}
          </div>
        )}
        {reminder.dueDate && (
          <div style={{ fontSize: 12, color: isPastDue ? "var(--accent-red)" : "var(--text-secondary)", marginTop: 2 }}>
            {reminder.dueDate}{reminder.dueTime && ` ${reminder.dueTime}`}
          </div>
        )}
      </div>

      {hovered && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(reminder.id); }}
          style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, color: "var(--text-secondary)", fontSize: 18, lineHeight: 1 }}
          aria-label="삭제"
        >
          ×
        </button>
      )}
    </div>
  );
}
