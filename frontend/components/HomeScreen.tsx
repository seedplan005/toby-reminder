"use client";

import { useState, useEffect } from "react";
import type { ReminderCounts } from "@/types";
import { getReminderCounts } from "@/lib/api";
import { useApp } from "@/context/AppContext";

const SMART_LISTS = [
  {
    key: "today" as const,
    label: "오늘",
    icon: "☀️",
    color: "#007AFF",
    filterKey: "today",
  },
  {
    key: "scheduled" as const,
    label: "예정",
    icon: "📅",
    color: "#FF3B30",
    filterKey: "scheduled",
  },
  {
    key: "all" as const,
    label: "전체",
    icon: "📋",
    color: "#1C1C1E",
    filterKey: "all",
  },
  {
    key: "flagged" as const,
    label: "깃발 표시됨",
    icon: "🚩",
    color: "#FF9500",
    filterKey: "flagged",
  },
  {
    key: "completed" as const,
    label: "완료됨",
    icon: "✅",
    color: "#8E8E93",
    filterKey: "completed",
  },
];

export default function HomeScreen() {
  const { setSelection } = useApp();
  const [counts, setCounts] = useState<ReminderCounts | null>(null);

  useEffect(() => {
    getReminderCounts()
      .then(setCounts)
      .catch(console.error);
  }, []);

  return (
    <div
      style={{
        padding: "32px 24px",
        overflowY: "auto",
        height: "100%",
      }}
    >
      <h1
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: 24,
        }}
      >
        리마인더
      </h1>

      {/* Smart list card grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 12,
          maxWidth: 480,
        }}
      >
        {SMART_LISTS.map((item) => {
          const count = counts?.[item.key as keyof ReminderCounts] ?? 0;
          return (
            <SmartListCard
              key={item.key}
              icon={item.icon}
              label={item.label}
              count={count}
              color={item.color}
              onClick={() =>
                setSelection({
                  type: "smart",
                  filter: item.filterKey as "today" | "scheduled" | "all" | "flagged" | "completed",
                })
              }
            />
          );
        })}
      </div>
    </div>
  );
}

function SmartListCard({
  icon,
  label,
  count,
  color,
  onClick,
}: {
  icon: string;
  label: string;
  count: number;
  color: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(0,0,0,0.05)" : "var(--surface)",
        border: "none",
        borderRadius: 14,
        padding: "16px",
        textAlign: "left",
        cursor: "pointer",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        transition: "background 0.1s ease, transform 0.1s ease",
        transform: hovered ? "scale(0.98)" : "scale(1)",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          marginBottom: 12,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: color,
          marginBottom: 2,
        }}
      >
        {count}
      </div>
      <div style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 500 }}>
        {label}
      </div>
    </button>
  );
}
