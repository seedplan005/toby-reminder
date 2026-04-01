"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { ReminderList } from "@/types";
import { getLists } from "@/lib/api";

type Selection =
  | { type: "smart"; filter: "today" | "scheduled" | "all" | "flagged" | "completed" }
  | { type: "list"; id: number }
  | null;

interface AppContextValue {
  lists: ReminderList[];
  refreshLists: () => Promise<void>;
  selection: Selection;
  setSelection: (s: Selection) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lists, setLists] = useState<ReminderList[]>([]);
  const [selection, setSelection] = useState<Selection>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const refreshLists = useCallback(async () => {
    try {
      const data = await getLists();
      setLists(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    refreshLists();
  }, [refreshLists]);

  return (
    <AppContext.Provider
      value={{ lists, refreshLists, selection, setSelection, sidebarOpen, setSidebarOpen }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
