"use client";

import { useApp } from "@/context/AppContext";
import ReminderListView from "@/components/ReminderList";

export default function HomePage() {
  const { lists, selection, refreshLists } = useApp();

  if (selection?.type === "list") {
    const list = lists.find((l) => l.id === selection.id);
    return (
      <ReminderListView
        listId={selection.id}
        listColor={list?.color}
        title={list?.name ?? "리마인더"}
        onReminderCountChange={refreshLists}
      />
    );
  }

  // Default: show all reminders (no list filter)
  return (
    <ReminderListView
      listId={null}
      title="전체 리마인더"
      onReminderCountChange={refreshLists}
    />
  );
}
