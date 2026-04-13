import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DeleteProfileButton } from "~/app/_components/profile/DeleteProfileButton";

const refreshMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: refreshMock,
  }),
}));

const mutateMock = vi.fn();

vi.mock("~/trpc/react", () => ({
  api: {
    userProfileRouter: {
      deleteProfile: {
        useMutation: ({ onSuccess }: any) => ({
          mutate: (data: any) => {
            mutateMock(data);
            onSuccess?.();
          },
        }),
      },
    },
  },
}));

describe("DeleteProfileButton", () => {
  it("вызывает удаление профиля и refresh", () => {
    render(
      <DeleteProfileButton
        userId="1"
        pilotId="10"
        judgeId="20"
      />
    );

    fireEvent.click(screen.getByText("Удалить профиль"));

    expect(mutateMock).toHaveBeenCalledWith({
      id_user: "1",
      id_pilot: "10",
      id_judge: "20",
    });

    expect(refreshMock).toHaveBeenCalled();
  });
});