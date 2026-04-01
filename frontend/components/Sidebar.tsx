"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { deleteList } from "@/lib/api";
import CreateListModal from "./CreateListModal";
import type { ReminderList } from "@/types";

export default function Sidebar() {
  const { lists, refreshLists, selection, setSelection } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingList, setEditingList] = useState<ReminderList | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    listId: number;
    x: number;
    y: number;
  } | null>(null);

  const handleDeleteList = async (id: number) => {
    try {
      await deleteList(id);
      await refreshLists();
      // Clear selection if deleted list was selected
      if (selection?.type === "list" && selection.id === id) {
        setSelection(null);
      }
    } catch (e) {
      console.error(e);
    }
    setContextMenu(null);
  };

  const handleContextMenu = (
    e: React.MouseEvent,
    listId: number
  ) => {
    e.preventDefault();
    setContextMenu({ listId, x: e.clientX, y: e.clientY });
  };

  return (
    <>
      <aside
        style={{
          width: 250,
          flexShrink: 0,
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 0",
          }}
        >
          {/* My Lists */}
          <div
            style={{
              padding: "0 12px",
              marginBottom: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              내 리스트
            </span>
          </div>

          {lists.map((list) => {
            const isSelected =
              selection?.type === "list" && selection.id === list.id;
            return (
              <div
                key={list.id}
                onClick={() => setSelection({ type: "list", id: list.id })}
                onContextMenu={(e) => handleContextMenu(e, list.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 16px",
                  cursor: "pointer",
                  borderRadius: 8,
                  margin: "0 4px",
                  background: isSelected ? "var(--accent-blue)" : "transparent",
                  color: isSelected ? "white" : "var(--text-primary)",
                  transition: "background 0.1s ease",
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
                <span
                  style={{
                    flex: 1,
                    fontSize: 15,
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {list.name}
                </span>
                {list.reminderCount > 0 && (
                  <span
                    style={{
                      fontSize: 13,
                      color: isSelected ? "rgba(255,255,255,0.8)" : "var(--text-secondary)",
                      minWidth: 16,
                      textAlign: "right",
                    }}
                  >
                    {list.reminderCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Add list button */}
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid var(--border)",
          }}
        >
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--accent-blue)",
              fontSize: 15,
              fontWeight: 500,
              padding: 0,
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
          <div
            onClick={() => setContextMenu(null)}
            style={{ position: "fixed", inset: 0, zIndex: 999 }}
          />
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
              style={contextMenuItemStyle}
            >
              편집
            </button>
            <button
              onClick={() => handleDeleteList(contextMenu.listId)}
              style={{ ...contextMenuItemStyle, color: "var(--accent-red)" }}
            >
              삭제
            </button>
          </div>
        </>
      )}

      {/* Create / Edit modal */}
      {(showCreateModal || editingList) && (
        <CreateListModal
          editing={editingList}
          onClose={() => {
            setShowCreateModal(false);
            setEditingList(null);
          }}
          onSaved={async () => {
            await refreshLists();
          }}
        />
      )}
    </>
  );
}

const contextMenuItemStyle: React.CSSProperties = {
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
