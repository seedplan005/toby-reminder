import { render, screen, waitFor } from "@testing-library/react";
import HomePage from "./page";
import type { ReminderList } from "@/types";

// Mock context
jest.mock("@/context/AppContext", () => ({
  useApp: jest.fn(),
}));

// Mock ReminderList component
jest.mock("@/components/ReminderList", () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="reminder-list">{title}</div>,
}));

import { useApp } from "@/context/AppContext";

const mockList: ReminderList = {
  id: 1,
  name: "업무",
  color: "#007AFF",
  icon: null,
  displayOrder: 1,
  reminderCount: 3,
  createdAt: "2026-04-02T00:00:00",
  updatedAt: "2026-04-02T00:00:00",
};

describe("HomePage", () => {
  it("선택된 리스트가 없으면 전체 리마인더를 표시한다", () => {
    (useApp as jest.Mock).mockReturnValue({
      lists: [mockList],
      selection: null,
      refreshLists: jest.fn(),
    });
    render(<HomePage />);
    expect(screen.getByText("전체 리마인더")).toBeInTheDocument();
  });

  it("리스트 선택 시 해당 리스트 이름을 헤더로 표시한다", () => {
    (useApp as jest.Mock).mockReturnValue({
      lists: [mockList],
      selection: { type: "list", id: 1 },
      refreshLists: jest.fn(),
    });
    render(<HomePage />);
    expect(screen.getByText("업무")).toBeInTheDocument();
  });
});
