import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { UserProfile } from "~/app/_components/profile/UserProfile";

vi.mock("@/app/_components/profile/EditBaseProfileModal", () => ({
  EditBaseProfileModal: () => <div>Редактировать профиль</div>,
}));

vi.mock("@/app/_components/profile/DeleteProfileButton", () => ({
  DeleteProfileButton: () => <button>Удалить профиль</button>,
}));

describe("UserProfile", () => {
  it("рендерит данные пользователя", () => {
    render(
      <UserProfile
        user={{
          id: "1",
          firstname: "Ivan",
          surname: "Ivanov",
          email: "ivan@test.com",
          role: "USER",
          tournaments: [],
        }}
      />
    );

    expect(screen.getByText("Ivan Ivanov")).toBeInTheDocument();
    expect(screen.getByText("ivan@test.com")).toBeInTheDocument();
    expect(screen.getByText("Роль: Пользователь")).toBeInTheDocument();
    expect(screen.getByText("Редактировать профиль")).toBeInTheDocument();
    expect(screen.getByText("Удалить профиль")).toBeInTheDocument();
  });
});