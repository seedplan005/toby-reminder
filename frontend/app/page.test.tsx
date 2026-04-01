import { render, screen } from "@testing-library/react";
import HomePage from "./page";
import type { ReminderList } from "@/types";

// Mock context
jest.mock("@/context/AppContext", () => ({
  useApp: jest.fn(),
}));

// Mock child components
jest.mock("@/components/ReminderList", () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => (
    <div data-testid="reminder-list">{title}</div>
  ),
}));

jest.mock("@/components/HomeScreen", () => ({
  __esModule: true,
  default: () => <div data-testid="home-screen">홈 화면</div>,
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
  it("선택 없으면 홈 화면을 표시한다", () => {
    (useApp as jest.Mock).mockReturnValue({
      lists: [mockList],
      selection: null,
      refreshLists: jest.fn(),
    });
    render(<HomePage />);
    expect(screen.getByTestId("home-screen")).toBeInTheDocument();
  });

  it("리스트 선택 시 해당 리스트 이름을 표시한다", () => {
    (useApp as jest.Mock).mockReturnValue({
      lists: [mockList],
      selection: { type: "list", id: 1 },
      refreshLists: jest.fn(),
    });
    render(<HomePage />);
    expect(screen.getByText("업무")).toBeInTheDocument();
  });

  it("스마트 리스트 선택 시 해당 이름을 표시한다", () => {
    (useApp as jest.Mock).mockReturnValue({
      lists: [mockList],
      selection: { type: "smart", filter: "today" },
      refreshLists: jest.fn(),
    });
    render(<HomePage />);
    expect(screen.getByText("오늘")).toBeInTheDocument();
  });
});
