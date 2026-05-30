"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { api } from "~/trpc/react";
import { DateFromFormate } from "~/lib/clear-format";
import { ChatType } from "@prisma/client";


interface Props {
  open: boolean;
  onClose: () => void;
  TypeChat: "GROUP" | "CHANNEL"
}

export function CreateChannelAndGroupModal({open, onClose, TypeChat,}: Props){
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const { data: users } = api.chats.getUsers.useQuery();

  const utils = api.useUtils();
  const createChannel = api.chats.createChannelAndGroup.useMutation({
    onSuccess: () => {
      utils.chats.getChats.invalidate();
      setName("");
      setDescription("");
      setSelectedMembers([]);
      onClose();
    },
  });

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[90vh] bg-gray-900 rounded-3xl p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ЗАГОЛОВОК */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-800"
          >
            <ArrowLeft size={22} />
          </button>

          <h2 className="text-xl font-bold text-white">
            Создание {TypeChat === ChatType.CHANNEL ? "канала" : "группы"}
          </h2>
          
          <div className="w-10" />
        </div>

        <div className="flex flex-col gap-5">

          {/* НАЗВАНИЕ */}
          <div>
            <span className="text-sm text-gray-400">
              Название {TypeChat === ChatType.CHANNEL ? "канала" : "группы"}
            </span>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите название"
              className="
                mt-2 w-full bg-gray-800 text-white
                rounded-xl px-4 py-3 outline-none
              "
            />
          </div>

          {/* ОПИСАНИЕ */}
          <div>
            <span className="text-sm text-gray-400">
              Описание
            </span>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Введите описание"
              className="
                mt-2 w-full bg-gray-800 text-white
                rounded-xl px-4 py-3 outline-none resize-none
              "
            />
          </div>

          {/* СТАТИКА */}
          <div className="grid grid-cols-2 gap-3">

            <div className="bg-gray-800 rounded-xl p-4">
              <div className="text-xs text-gray-400 mb-1">
                Тип чата
              </div>

              <div className="text-white">
                {TypeChat === ChatType.CHANNEL ? "Канал" : "Группа"}
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-4">
              <div className="text-xs text-gray-400 mb-1">
                Дата создания
              </div>

              <div className="text-white">
                {DateFromFormate(new Date())}
              </div>
            </div>

          </div>

          {/* ПОЛЬЗОВАТЕЛИ */}
          <div>
            <div className="text-sm text-gray-400 mb-2">
              Участники
            </div>

            <div className="max-h-64 overflow-auto flex flex-col gap-2">
              {users?.map((user) => {
                const selected = selectedMembers.includes(user.id);
                
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => {
                      if (selected) {
                        setSelectedMembers((prev) =>
                          prev.filter((id) => id !== user.id)
                        );
                      } else {
                        setSelectedMembers((prev) => [
                          ...prev,
                          user.id,
                        ]);
                      }
                    }}
                    className={`
                      flex items-center gap-3
                      p-3 rounded-xl transition
                      ${
                        selected
                          ? "bg-blue-600"
                          : "bg-gray-800 hover:bg-gray-700"
                      }
                    `}
                  >
                    <img
                      src={user.image ?? "/default-avatar.jpg"}
                      className="w-10 h-10 rounded-full"
                    />

                    <span className="text-white">
                      {user.firstname} {user.surname}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* КНОПКИ */}
          <div className="flex gap-3">
            <button
              disabled={!name.trim()}
              onClick={() =>
                createChannel.mutate({
                  name,
                  description,
                  memberIds: selectedMembers,
                  chatType: TypeChat,
                })
              }
              className="
                flex-1 py-3 rounded-xl
                bg-blue-600 text-white
                disabled:opacity-50
              "
            >
              Создать {TypeChat === ChatType.CHANNEL ? "канала" : "группы"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}