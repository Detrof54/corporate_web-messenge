"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import type { UserProfileProps } from "./UserProfile";
import { Edit3, Folder, Pen, UserPen } from "lucide-react";


export function EditBaseProfileModal({ user }: {user : UserProfileProps}) {
  const utils = api.useUtils();
  const [open, setOpen] = useState(false);

  const [firstname, setFirstname] = useState(user.firstname ?? "");
  const [surname, setSurname] = useState(user.surname ?? "");
  const [patronymic, setPatronymic] = useState(user.patronymic ?? "");

  const updateBaseProfile =
    api.profile.updateBaseProfile.useMutation({
      onSuccess: () => {
        utils.profile.getInfoUserById.invalidate({ id: user.id });
        setOpen(false)
      },
    });


  return (
    <>
      <button onClick={() => setOpen(true)} className="
        flex flex-col items-center justify-center
        w-1 h-1
        rounded-2xl
        transition-all duration-200
        text-gray-500 hover:text-white hover:bg-gray-800">
        <div className="text-xl"><Edit3 size={25}/></div>
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl mb-4">Редактирование профиля</h2>
            <span className="text-xs text-gray-500">Фамилия</span>
            <input
              className="w-full mb-2 p-2 bg-gray-700 rounded"
              placeholder="Фамилия"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
            <span className="text-xs text-gray-500">Имя</span>
            <input
              className="w-full mb-2 p-2 bg-gray-700 rounded"
              placeholder="Имя"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            <span className="text-xs text-gray-500">Отчество</span>
            <input
              className="w-full mb-4 p-2 bg-gray-700 rounded"
              placeholder="Отчество"
              value={patronymic}
              onChange={(e) => setPatronymic(e.target.value)}
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
                    patronymic,
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