import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import HomePage from "./page";
import type { Reminder } from "@/types";

// Mock API module
jest.mock("@/lib/api", () => ({
  getReminders: jest.fn(),
  createReminder: jest.fn(),
  toggleComplete: jest.fn(),
  deleteReminder: jest.fn(),
}));

import * as api from "@/lib/api";

const mockReminder = (overrides: Partial<Reminder> = {}): Reminder => ({
  id: 1,
  title: "테스트 리마인더",
  completed: false,
  listId: null,
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

describe("HomePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (api.getReminders as jest.Mock).mockResolvedValue([mockReminder()]);
    (api.createReminder as jest.Mock).mockResolvedValue(
      mockReminder({ id: 2, title: "새 항목" })
    );
    (api.toggleComplete as jest.Mock).mockResolvedValue(
      mockReminder({ completed: true })
    );
    (api.deleteReminder as jest.Mock).mockResolvedValue(undefined);
  });

  it("리마인더 목록을 렌더링한다", async () => {
    render(<HomePage />);
    await waitFor(() => {
      expect(screen.getByText("테스트 리마인더")).toBeInTheDocument();
    });
  });

  it("새 리마인더를 입력하고 Enter로 추가한다", async () => {
    render(<HomePage />);
    await waitFor(() => screen.getByText("테스트 리마인더"));

    const input = screen.getByPlaceholderText("새로운 리마인더");
    fireEvent.change(input, { target: { value: "새 항목" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByText("새 항목")).toBeInTheDocument();
    });
    expect(api.createReminder).toHaveBeenCalledWith("새 항목");
  });

  it("완료 버튼 클릭 시 페이드아웃 처리된다", async () => {
    jest.useFakeTimers();
    render(<HomePage />);
    await waitFor(() => screen.getByText("테스트 리마인더"));

    const checkBtn = screen.getByLabelText("완료");
    act(() => {
      fireEvent.click(checkBtn);
    });

    // Should be in fade-out class
    const item = screen.getByText("테스트 리마인더").closest("div");
    expect(
      item?.closest("[class]")?.className.includes("reminder-fade-out") ||
      document.querySelector(".reminder-fade-out") !== null
    ).toBe(true);

    act(() => {
      jest.advanceTimersByTime(600);
    });

    await waitFor(() => {
      expect(screen.queryByText("테스트 리마인더")).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it("삭제 버튼은 hover 시 표시되며 클릭 시 항목을 제거한다", async () => {
    render(<HomePage />);
    await waitFor(() => screen.getByText("테스트 리마인더"));

    // 행에 마우스 진입하여 삭제 버튼 표시
    const titleEl = screen.getByText("테스트 리마인더");
    fireEvent.mouseEnter(titleEl.parentElement!);

    const deleteBtn = screen.getByLabelText("삭제");
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(screen.queryByText("테스트 리마인더")).not.toBeInTheDocument();
    });
    expect(api.deleteReminder).toHaveBeenCalledWith(1);
  });
});
