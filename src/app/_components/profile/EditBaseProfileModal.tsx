"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface Props {
  user: {
    id: string;
    firstname?: string | null;
    surname?: string | null;
  };
}

export function EditBaseProfileModal({ user }: Props) {
  const utils = api.useUtils();
  const [open, setOpen] = useState(false);
  const [firstname, setFirstname] = useState(user.firstname ?? "");
  const [surname, setSurname] = useState(user.surname ?? "");

  const updateBaseProfile =
    api.userProfileRouter.updateBaseProfile.useMutation({
      onSuccess: () => {
        utils.userProfileRouter.getUserById.invalidate({ id: user.id });
        setOpen(false)
      },
    });

  return (
    <>
      <button onClick={() => setOpen(true)} className="mt-4 text-blue-400">
        Редактировать профиль
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl mb-4">Редактирование профиля</h2>

            <input
              className="w-full mb-2 p-2 bg-gray-700 rounded"
              placeholder="Имя"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />

            <input
              className="w-full mb-4 p-2 bg-gray-700 rounded"
              placeholder="Фамилия"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setOpen(false)}>Отмена</button>
              <button
                className="text-green-400"
                onClick={() =>
                  updateBaseProfile.mutate({
                    id: user.id,
                    firstname,
                    surname,
                  })
                }
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}