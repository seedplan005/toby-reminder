"use client";

import type { ReactNode } from "react";
import { useApp } from "@/context/AppContext";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: ReactNode }) {
  const { sidebarOpen } = useApp();

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
        }}
      >
        {children}
      </main>
    </div>
  );
}
