"use client";

import { useEffect, type ReactNode } from "react";
import { useApp } from "@/context/AppContext";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: ReactNode }) {
  const { sidebarOpen, setSidebarOpen } = useApp();

  // Auto-close sidebar on mobile
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setSidebarOpen(false);
    };
    if (mq.matches) setSidebarOpen(false);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <div
        className="app-sidebar-wrapper"
        data-open={sidebarOpen ? "true" : "false"}
        style={{ width: sidebarOpen ? 250 : 0 }}
      >
        <Sidebar />
      </div>

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            display: "none",
            position: "fixed",
            inset: 0,
            zIndex: 99,
            background: "rgba(0,0,0,0.3)",
          }}
          className="mobile-backdrop"
        />
      )}

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
