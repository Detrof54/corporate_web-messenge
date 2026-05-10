"use client";

import { useMemo, useState } from "react";

import { X } from "lucide-react";

import { api } from "~/trpc/react";

import { ChatRole } from "@prisma/client";

interface Props {
  open: boolean;
  onClose: () => void;

  chatId: string;

  members: {
    id: string;
    role: ChatRole;

    user: {
      id: string;
      image: string | null;
      firstname: string | null;
      surname: string | null;
      email: string | null;
    };
  }[];
}

function roleLabel(role: ChatRole) {
  if (role === "OWNER") return "Владелец";
  if (role === "ADMIN") return "Администратор";

  return "Участник";
}

export function DeleteMembersGCModal({
  open,
  onClose,
  chatId,
  members,
}: Props) {
  const utils = api.useUtils();

  const [search, setSearch] = useState("");

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const deleteMembers =
    api.profileGC.deleteMembersFromChat.useMutation({
      onSuccess: async () => {
        await utils.profileGC.getGroupChannelInfo.invalidate({
          id: chatId,
        });

        setSelectedMembers([]);

        onClose();
      },
    });

  const filteredMembers = useMemo(() => {
    return members
      .filter((member) => member.role !== ChatRole.OWNER)
      .filter((member) => {
        const fullName =
          `${member.user.firstname ?? ""} ${member.user.surname ?? ""}`
            .toLowerCase();

        return fullName.includes(search.toLowerCase());
      });
  }, [members, search]);

  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        bg-black/60
        flex items-center justify-center
        p-4
      "
      onClick={onClose}
    >
      <div
        className="
          w-full max-w-2xl
          bg-gray-900
          rounded-3xl
          p-6
          flex flex-col gap-5
          max-h-[90vh]
        "
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}
        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-bold text-white">
            Удаление участников
          </h2>

          <button
            onClick={onClose}
            className="
              w-10 h-10
              flex items-center justify-center
              rounded-xl
              bg-gray-800 hover:bg-gray-700
              transition
            "
          >
            <X size={18} />
          </button>

        </div>

        {/* SEARCH */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск участников"
          className="
            w-full
            bg-gray-800
            text-white
            rounded-2xl
            px-4 py-3
            outline-none
          "
        />

        {/* USERS */}
        <div
          className="
            flex flex-col gap-2
            overflow-y-auto
            max-h-[420px]
            pr-1
          "
        >
          {filteredMembers.map((member) => {
            const selected =
              selectedMembers.includes(member.user.id);

            return (
              <button
                key={member.id}
                type="button"
                onClick={() => {
                  if (selected) {
                    setSelectedMembers((prev) =>
                      prev.filter(
                        (id) => id !== member.user.id
                      )
                    );
                  } else {
                    setSelectedMembers((prev) => [
                      ...prev,
                      member.user.id,
                    ]);
                  }
                }}
                className={`
                  flex items-center gap-3
                  p-3 rounded-2xl
                  transition
                  min-w-0
                  ${
                    selected
                      ? "bg-red-600"
                      : "bg-gray-800 hover:bg-gray-700"
                  }
                `}
              >

                <img
                  src={
                    member.user.image ??
                    "/default-avatar.jpg"
                  }
                  className="
                    w-12 h-12
                    rounded-full
                    object-cover
                    flex-shrink-0
                  "
                />

                <div className="flex flex-col flex-1 min-w-0 text-left">

                  <span className="text-white truncate">
                    {member.user.firstname}{" "}
                    {member.user.surname}
                  </span>

                  <span className="text-sm text-gray-400 truncate">
                    {member.user.email}
                  </span>

                </div>

                <div
                  className="
                    px-3 py-1
                    rounded-full
                    bg-black/30
                    text-gray-300
                    text-xs
                    whitespace-nowrap
                  "
                >
                  {roleLabel(member.role)}
                </div>

              </button>
            );
          })}
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3">

          <button
            onClick={onClose}
            className="
              flex-1 py-3
              rounded-2xl
              bg-gray-800
              hover:bg-gray-700
              transition
              text-white
            "
          >
            Отмена
          </button>

          <button
            disabled={selectedMembers.length === 0}
            onClick={() => {
              deleteMembers.mutate({
                chatId,
                memberIds: selectedMembers,
              });
            }}
            className="
              flex-1 py-3
              rounded-2xl
              bg-red-600
              hover:bg-red-500
              transition
              text-white
              disabled:opacity-50
            "
          >
            Удалить
          </button>

        </div>

      </div>
    </div>
  );
}