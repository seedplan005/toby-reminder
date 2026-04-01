"use client";

import { useApp } from "@/context/AppContext";
import ReminderListView from "@/components/ReminderList";
import HomeScreen from "@/components/HomeScreen";

const SMART_LIST_LABELS: Record<string, string> = {
  today: "오늘",
  scheduled: "예정",
  all: "전체",
  flagged: "깃발 표시됨",
  completed: "완료됨",
};

const SMART_LIST_COLORS: Record<string, string> = {
  today: "#007AFF",
  scheduled: "#FF3B30",
  all: "#1C1C1E",
  flagged: "#FF9500",
  completed: "#8E8E93",
};

function smartFilterParams(filter: string): Record<string, string> {
  switch (filter) {
    case "today":
      return { dueDate: new Date().toISOString().slice(0, 10) };
    case "scheduled":
      return {
        dueBefore: new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
      };
    case "all":
      return { completed: "false" };
    case "flagged":
      return { flagged: "true" };
    case "completed":
      return { completed: "true" };
    default:
      return {};
  }
}

export default function HomePage() {
  const { lists, selection, refreshLists } = useApp();

  const key = selection
    ? selection.type === "list"
      ? `list-${selection.id}`
      : `smart-${selection.filter}`
    : "home";

  if (selection?.type === "list") {
    const list = lists.find((l) => l.id === selection.id);
    return (
      <div key={key} className="main-content-transition" style={{ height: "100%", overflow: "hidden" }}>
        <ReminderListView
          listId={selection.id}
          listColor={list?.color}
          title={list?.name ?? "리마인더"}
          onReminderCountChange={refreshLists}
        />
      </div>
    );
  }

  if (selection?.type === "smart") {
    const filter = selection.filter;
    const raw = smartFilterParams(filter);
    // Convert to filterParams shape
    const filterParams: Parameters<typeof ReminderListView>[0]["filterParams"] = {};
    if (raw.completed !== undefined) filterParams.completed = raw.completed === "true";
    if (raw.flagged !== undefined) filterParams.flagged = raw.flagged === "true";
    if (raw.dueDate !== undefined) filterParams.dueDate = raw.dueDate;
    if (raw.dueBefore !== undefined) filterParams.dueBefore = raw.dueBefore;

    return (
      <div key={key} className="main-content-transition" style={{ height: "100%", overflow: "hidden" }}>
        <ReminderListView
          filterParams={filterParams}
          listColor={SMART_LIST_COLORS[filter]}
          title={SMART_LIST_LABELS[filter] ?? filter}
          onReminderCountChange={refreshLists}
        />
      </div>
    );
  }

  return (
    <div key={key} className="main-content-transition" style={{ height: "100%", overflow: "hidden" }}>
      <HomeScreen />
    </div>
  );
}
