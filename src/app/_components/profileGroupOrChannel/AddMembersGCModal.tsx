"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { api } from "~/trpc/react";
import { ChatRole } from "@prisma/client";

interface Props {
  open: boolean;
  onClose: () => void;
  chatId: string;
  existingMemberIds: string[];
}

export function AddMembersGCModal({open, onClose, chatId, existingMemberIds,}: Props) {
  const utils = api.useUtils();

  const { data: users } = api.chats.getUsers.useQuery();

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const addMembers = api.profileGC.addMembers.useMutation({
    onSuccess: async () => {
      await utils.profileGC.getGroupChannelInfo.invalidate({ id: chatId });
      setSelected([]);
      setSearch("");
      onClose();
    },
  });

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users
      .filter((u) => !existingMemberIds.includes(u.id)) 
      .filter((u) => {
        const fullName =
          `${u.firstname ?? ""} ${u.surname ?? ""}`.toLowerCase();

        return fullName.includes(search.toLowerCase());
      });
  }, [users, search, existingMemberIds]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-gray-900 rounded-3xl p-6 flex flex-col gap-4 max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Заголовок */}
        <div className="flex justify-between items-center">
          <h2 className="text-white text-xl font-bold">
            Добавить участников
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Поисковая строка */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по имени..."
          className="w-full bg-gray-800 text-white rounded-2xl px-4 py-3 outline-none"
        />

        {/* Список пользователей */}
        <div className="flex flex-col gap-2 overflow-y-auto pr-1 max-h-[50vh]">
          {filteredUsers.map((user) => {
            const selectedUser = selected.includes(user.id);
            return (
              <button
                key={user.id}
                onClick={() => {
                  setSelected((prev) =>
                    prev.includes(user.id)
                      ? prev.filter((id) => id !== user.id)
                      : [...prev, user.id]
                  );
                }}
                className={`flex items-center gap-3 p-3 rounded-2xl transition
                  ${selectedUser ? "bg-violet-600" : "bg-gray-800 hover:bg-gray-700"}`}
              >
                <img
                  src={user.image ?? "/default-avatar.jpg"}
                  className="w-10 h-10 rounded-full object-cover"
                />

                <div className="flex flex-col text-left">
                  <span className="text-white">
                    {user.firstname} {user.surname}
                  </span>

                  <span className="text-sm text-gray-400">
                    {user.email}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-gray-800 text-white hover:bg-gray-700"
          >
            Отмена
          </button>

          <button
            disabled={selected.length === 0}
            onClick={() =>
              addMembers.mutate({
                chatId,
                userIds: selected,
                role: ChatRole.USER,
              })
            }
            className="
              flex-1 py-3 rounded-2xl bg-violet-600
              text-white hover:bg-violet-500 disabled:opacity-50
            "
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
}