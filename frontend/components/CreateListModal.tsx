"use client";

import { useState, useEffect, useRef } from "react";
import { createList, updateList } from "@/lib/api";
import type { ReminderList } from "@/types";

const LIST_ICONS = [
  "📋", "🏠", "🏢", "💼", "🛒", "📚", "🎯", "💡",
  "🏋️", "🍎", "✈️", "🎵", "💊", "🔑", "📝", "⭐",
];

const APPLE_COLORS = [
  "#FF3B30", // Red
  "#FF9500", // Orange
  "#FFCC00", // Yellow
  "#34C759", // Green
  "#00C7BE", // Mint
  "#32ADE6", // Teal
  "#007AFF", // Blue
  "#5856D6", // Indigo
  "#AF52DE", // Purple
  "#FF2D55", // Pink
  "#A2845E", // Brown
  "#8E8E93", // Gray
];

interface Props {
  onClose: () => void;
  onSaved: () => void;
  editing?: ReminderList | null;
}

export default function CreateListModal({ onClose, onSaved, editing }: Props) {
  const [name, setName] = useState(editing?.name ?? "");
  const [color, setColor] = useState(editing?.color ?? APPLE_COLORS[6]);
  const [icon, setIcon] = useState<string | null>(editing?.icon ?? null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      if (editing) {
        await updateList(editing.id, trimmed, color, icon);
      } else {
        await createList(trimmed, color, icon);
      }
      onSaved();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface)",
          borderRadius: 14,
          padding: 24,
          width: 320,
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        }}
      >
        <h2
          style={{
            margin: "0 0 16px",
            fontSize: 17,
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          {editing ? "리스트 편집" : "새로운 리스트"}
        </h2>

        {/* Color preview + name input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "var(--bg)",
            borderRadius: 10,
            padding: "10px 14px",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: color,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            {icon && <span>{icon}</span>}
          </div>
          <input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
              if (e.key === "Escape") onClose();
            }}
            placeholder="리스트 이름"
            style={{
              flex: 1,
              fontSize: 16,
              fontWeight: 500,
              background: "transparent",
              border: "none",
              outline: "none",
            }}
          />
        </div>

        {/* Color palette */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 10,
            marginBottom: 16,
          }}
        >
          {APPLE_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              style={{
                width: "100%",
                aspectRatio: "1",
                borderRadius: "50%",
                background: c,
                border: color === c ? "3px solid var(--text-primary)" : "3px solid transparent",
                cursor: "pointer",
                padding: 0,
                outline: "none",
              }}
              aria-label={`색상 ${c}`}
            />
          ))}
        </div>

        {/* Icon picker */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8, fontWeight: 500 }}>아이콘 (선택)</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 6 }}>
            <button
              onClick={() => setIcon(null)}
              style={{
                width: "100%", aspectRatio: "1", borderRadius: 8,
                border: icon === null ? "2px solid var(--accent-blue)" : "2px solid transparent",
                background: icon === null ? "rgba(0,122,255,0.1)" : "var(--bg)",
                cursor: "pointer", fontSize: 14, padding: 0,
              }}
              aria-label="아이콘 없음"
            >
              —
            </button>
            {LIST_ICONS.map((ic) => (
              <button
                key={ic}
                onClick={() => setIcon(ic)}
                style={{
                  width: "100%", aspectRatio: "1", borderRadius: 8,
                  border: icon === ic ? "2px solid var(--accent-blue)" : "2px solid transparent",
                  background: icon === ic ? "rgba(0,122,255,0.1)" : "var(--bg)",
                  cursor: "pointer", fontSize: 16, padding: 0,
                }}
                aria-label={`아이콘 ${ic}`}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              height: 40,
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "transparent",
              cursor: "pointer",
              fontSize: 15,
              color: "var(--text-primary)",
            }}
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || loading}
            style={{
              flex: 1,
              height: 40,
              borderRadius: 10,
              border: "none",
              background: "var(--accent-blue)",
              color: "white",
              cursor: name.trim() && !loading ? "pointer" : "not-allowed",
              fontSize: 15,
              fontWeight: 600,
              opacity: !name.trim() || loading ? 0.5 : 1,
            }}
          >
            {editing ? "저장" : "추가"}
          </button>
        </div>
      </div>
    </div>
  );
}
