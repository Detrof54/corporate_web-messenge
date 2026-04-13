import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EditBaseProfileModal } from "~/app/_components/profile/EditBaseProfileModal";

const mutateMock = vi.fn();

vi.mock("~/trpc/react", () => ({
  api: {
    userProfileRouter: {
      updateBaseProfile: {
        useMutation: () => ({
          mutate: mutateMock,
        }),
      },
    },
  },
}));

describe("EditBaseProfileModal", () => {
  it("открывает модалку и вызывает обновление профиля", () => {
    render(
      <EditBaseProfileModal
        user={{
          id: "1",
          firstname: "Ivan",
          surname: "Ivanov",
        }}
      />
    );

    fireEvent.click(screen.getByText("Редактировать профиль"));

    expect(
      screen.getByText("Редактирование профиля")
    ).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Имя"), {
      target: { value: "Petr" },
    });

    fireEvent.change(screen.getByPlaceholderText("Фамилия"), {
      target: { value: "Petrov" },
    });

    fireEvent.click(screen.getByText("Сохранить"));

    expect(mutateMock).toHaveBeenCalledWith({
      id: "1",
      firstname: "Petr",
      surname: "Petrov",
    });
  });
});