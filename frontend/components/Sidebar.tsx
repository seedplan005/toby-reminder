"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { deleteList, getReminderCounts, reorderLists } from "@/lib/api";
import CreateListModal from "./CreateListModal";
import type { ReminderCounts, ReminderList } from "@/types";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
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

const SMART_ITEMS: Array<{
  filter: "today" | "scheduled" | "all" | "flagged" | "completed";
  label: string;
  icon: string;
  color: string;
}> = [
  { filter: "today", label: "오늘", icon: "☀️", color: "#007AFF" },
  { filter: "scheduled", label: "예정", icon: "📅", color: "#FF3B30" },
  { filter: "all", label: "전체", icon: "📋", color: "#1C1C1E" },
  { filter: "flagged", label: "깃발 표시됨", icon: "🚩", color: "#FF9500" },
  { filter: "completed", label: "완료됨", icon: "✅", color: "#8E8E93" },
];

export default function Sidebar() {
  const { lists, refreshLists, selection, setSelection } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingList, setEditingList] = useState<ReminderList | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    listId: number;
    x: number;
    y: number;
  } | null>(null);
  const [counts, setCounts] = useState<ReminderCounts | null>(null);
  const [search, setSearch] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    getReminderCounts().then(setCounts).catch(console.error);
  }, []);

  const handleDeleteList = async (id: number) => {
    try {
      await deleteList(id);
      await refreshLists();
      if (selection?.type === "list" && selection.id === id) {
        setSelection(null);
      }
    } catch (e) {
      console.error(e);
    }
    setContextMenu(null);
  };

  const handleContextMenu = (e: React.MouseEvent, listId: number) => {
    e.preventDefault();
    setContextMenu({ listId, x: e.clientX, y: e.clientY });
  };

  const filteredLists = search.trim()
    ? lists.filter((l) => l.name.toLowerCase().includes(search.toLowerCase()))
    : lists;

  const handleListDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = lists.findIndex((l) => l.id === Number(active.id));
    const newIndex = lists.findIndex((l) => l.id === Number(over.id));
    const reordered = arrayMove(lists, oldIndex, newIndex);
    // Optimistic update via refreshLists after API call
    try {
      await reorderLists(reordered.map((l) => l.id));
      await refreshLists();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <aside
        style={{
          width: 250,
          height: "100%",
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Search bar */}
        <div style={{ padding: "12px 12px 8px" }}>
          <div
            style={{
              background: "var(--bg)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
            }}
          >
            <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="검색"
              style={{ flex: 1, fontSize: 14, background: "transparent" }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-secondary)", fontSize: 14 }}
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {/* Smart lists */}
          {!search && (
            <>
              <div style={{ padding: "0 12px 4px" }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  스마트 리스트
                </span>
              </div>
              {SMART_ITEMS.map((item) => {
                const count = counts?.[item.filter as keyof ReminderCounts] ?? 0;
                const isSelected = selection?.type === "smart" && selection.filter === item.filter;
                return (
                  <div
                    key={item.filter}
                    onClick={() => setSelection({ type: "smart", filter: item.filter })}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "7px 16px",
                      cursor: "pointer",
                      borderRadius: 8,
                      margin: "0 4px",
                      background: isSelected ? "var(--accent-blue)" : "transparent",
                      color: isSelected ? "white" : "var(--text-primary)",
                    }}
                  >
                    <span style={{ fontSize: 15 }}>{item.icon}</span>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span>
                    {count > 0 && (
                      <span style={{ fontSize: 13, color: isSelected ? "rgba(255,255,255,0.8)" : "var(--text-secondary)" }}>
                        {count}
                      </span>
                    )}
                  </div>
                );
              })}

              <div style={{ height: 1, background: "var(--border)", margin: "8px 12px" }} />
            </>
          )}

          {/* My Lists */}
          <div style={{ padding: "0 12px 4px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              내 리스트
            </span>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleListDragEnd}>
            <SortableContext items={filteredLists.map((l) => l.id)} strategy={verticalListSortingStrategy}>
              {filteredLists.map((list) => (
                <SortableListItem
                  key={list.id}
                  list={list}
                  isSelected={selection?.type === "list" && selection.id === list.id}
                  onSelect={() => setSelection({ type: "list", id: list.id })}
                  onContextMenu={(e) => handleContextMenu(e, list.id)}
                />
              ))}
            </SortableContext>
          </DndContext>

          {filteredLists.length === 0 && search && (
            <div style={{ padding: "8px 16px", fontSize: 14, color: "var(--text-secondary)" }}>
              검색 결과 없음
            </div>
          )}
        </div>

        {/* Add list button */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "transparent", border: "none", cursor: "pointer",
              color: "var(--accent-blue)", fontSize: 15, fontWeight: 500, padding: 0,
            }}
          >
            <span style={{ fontSize: 20, lineHeight: 1 }}>+</span>
            목록 추가
          </button>
        </div>
      </aside>

      {/* Context menu */}
      {contextMenu && (
        <>
          <div onClick={() => setContextMenu(null)} style={{ position: "fixed", inset: 0, zIndex: 999 }} />
          <div
            style={{
              position: "fixed",
              left: contextMenu.x,
              top: contextMenu.y,
              background: "var(--surface)",
              borderRadius: 10,
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              padding: 4,
              zIndex: 1000,
              minWidth: 140,
            }}
          >
            <button
              onClick={() => {
                const list = lists.find((l) => l.id === contextMenu.listId);
                if (list) setEditingList(list);
                setContextMenu(null);
              }}
              style={ctxItemStyle}
            >
              편집
            </button>
            <button
              onClick={() => handleDeleteList(contextMenu.listId)}
              style={{ ...ctxItemStyle, color: "var(--accent-red)" }}
            >
              삭제
            </button>
          </div>
        </>
      )}

      {(showCreateModal || editingList) && (
        <CreateListModal
          editing={editingList}
          onClose={() => { setShowCreateModal(false); setEditingList(null); }}
          onSaved={async () => { await refreshLists(); }}
        />
      )}
    </>
  );
}

function SortableListItem({
  list,
  isSelected,
  onSelect,
  onContextMenu,
}: {
  list: ReminderList;
  isSelected: boolean;
  onSelect: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: list.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={onSelect}
      onContextMenu={onContextMenu}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 16px",
        cursor: isDragging ? "grabbing" : "pointer",
        borderRadius: 8,
        margin: "0 4px",
        background: isSelected ? "var(--accent-blue)" : "transparent",
        color: isSelected ? "white" : "var(--text-primary)",
        transition: isDragging ? undefined : "background 0.1s ease",
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: list.color,
          flexShrink: 0,
        }}
      />
      <span style={{ flex: 1, fontSize: 15, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {list.name}
      </span>
      {list.reminderCount > 0 && (
        <span style={{ fontSize: 13, color: isSelected ? "rgba(255,255,255,0.8)" : "var(--text-secondary)" }}>
          {list.reminderCount}
        </span>
      )}
    </div>
  );
}

const ctxItemStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "8px 14px",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontSize: 14,
  color: "var(--text-primary)",
  borderRadius: 6,
};
