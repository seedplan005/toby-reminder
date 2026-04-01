import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReminderListView from "./ReminderList";
import type { Reminder } from "@/types";

jest.mock("@/lib/api", () => ({
  getReminders: jest.fn(),
  createReminder: jest.fn(),
  toggleComplete: jest.fn(),
  deleteReminder: jest.fn(),
}));

jest.mock("@/context/AppContext", () => ({
  useApp: () => ({
    lists: [],
    refreshLists: jest.fn(),
    selection: null,
    setSelection: jest.fn(),
    sidebarOpen: true,
    setSidebarOpen: jest.fn(),
  }),
}));

import * as api from "@/lib/api";

const makeReminder = (overrides: Partial<Reminder> = {}): Reminder => ({
  id: 1,
  title: "업무 처리",
  completed: false,
  listId: 1,
  notes: null,
  dueDate: null,
  dueTime: null,
  priority: "NONE",
  flagged: false,
  completedAt: null,
  createdAt: "2026-04-02T00:00:00",
  updatedAt: "2026-04-02T00:00:00",
  ...overrides,
});

describe("ReminderListView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (api.getReminders as jest.Mock).mockResolvedValue([makeReminder()]);
    (api.createReminder as jest.Mock).mockResolvedValue(
      makeReminder({ id: 2, title: "새 항목" })
    );
    (api.toggleComplete as jest.Mock).mockResolvedValue(
      makeReminder({ completed: true })
    );
    (api.deleteReminder as jest.Mock).mockResolvedValue(undefined);
  });

  it("헤더에 리스트 이름을 표시한다", async () => {
    render(<ReminderListView title="업무" listId={1} />);
    expect(screen.getByText("업무")).toBeInTheDocument();
  });

  it("리마인더 목록을 렌더링한다", async () => {
    render(<ReminderListView title="업무" listId={1} />);
    await waitFor(() => {
      expect(screen.getByText("업무 처리")).toBeInTheDocument();
    });
  });

  it("새 리마인더를 Enter로 추가한다", async () => {
    render(<ReminderListView title="업무" listId={1} />);
    await waitFor(() => screen.getByText("업무 처리"));

    const input = screen.getByPlaceholderText("새로운 리마인더");
    fireEvent.change(input, { target: { value: "새 항목" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByText("새 항목")).toBeInTheDocument();
    });
  });
});
