"use client";

import type { ReactNode } from "react";
import { useApp } from "@/context/AppContext";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: ReactNode }) {
  const { sidebarOpen, setSidebarOpen } = useApp();

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "var(--bg)",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? 250 : 0,
          overflow: "hidden",
          transition: "width 0.2s ease",
          flexShrink: 0,
        }}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          background: "var(--bg)",
          position: "relative",
        }}
      >
        {/* Sidebar toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 10,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
            fontSize: 18,
            padding: 4,
            borderRadius: 6,
            lineHeight: 1,
          }}
          aria-label={sidebarOpen ? "사이드바 닫기" : "사이드바 열기"}
        >
          ☰
        </button>
        {children}
      </main>
    </div>
  );
}
