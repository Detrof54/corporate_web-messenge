"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { api } from "~/trpc/react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateDirectChatModal({
  open,
  onClose,
}: Props) {
  const utils = api.useUtils();

  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] =
    useState<string | null>(null);

  // Пользователи для создания direct
  const { data: users, isLoading } =
    api.chats.getUsersForDirect.useQuery(undefined, {
      enabled: open,
    });

  // Создание direct
  const createDirect =
    api.chats.createDirect.useMutation({
      onSuccess: () => {
        utils.chats.getChats.invalidate();

        setSelectedUserId(null);
        setSearch("");

        onClose();
      },
    });

  // Поиск только по имени и фамилии
  const filteredUsers = useMemo(() => {
    if (!users) return [];

    return users.filter((user) => {
      const fullname =
        `${user.firstname ?? ""} ${user.surname ?? ""}`
          .toLowerCase();

      return fullname.includes(search.toLowerCase());
    });
  }, [users, search]);

  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        bg-black/50
        flex items-center justify-center
        p-4
      "
      onClick={onClose}
    >
      <div
        className="
          w-full max-w-lg
          max-h-[90vh]
          overflow-y-auto
          bg-gray-900
          rounded-3xl
          p-6
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onClose}
            className="
              p-2 rounded-xl
              hover:bg-gray-800
              transition
            "
          >
            <ArrowLeft size={22} />
          </button>

          <h2 className="text-xl font-bold text-white">
            Новый личный чат
          </h2>

          <div className="w-10" />
        </div>

        {/* SEARCH */}
        <div className="relative mb-5">
          <Search
            size={18}
            className="
              absolute left-3 top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Поиск пользователя..."
            className="
              w-full
              bg-gray-800
              text-white
              rounded-xl
              pl-10 pr-4 py-3
              outline-none
            "
          />
        </div>

        {/* LIST */}
        <div className="flex flex-col gap-2">
          {isLoading && (
            <div className="text-gray-400 text-center py-10">
              Загрузка...
            </div>
          )}

          {!isLoading &&
            filteredUsers.map((user) => {
              const selected =
                selectedUserId === user.id;

              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() =>
                    setSelectedUserId(user.id)
                  }
                  className={`
                    flex items-center gap-3
                    p-3 rounded-2xl
                    transition-all duration-200
                    border
                    ${
                      selected
                        ? "bg-blue-600 border-blue-500"
                        : "bg-gray-800 border-transparent hover:bg-gray-700"
                    }
                  `}
                >
                  {/* AVATAR */}
                  <img
                    src={
                      user.image ??
                      "/default-avatar.jpg"
                    }
                    alt="avatar"
                    className="
                      w-12 h-12
                      rounded-full
                      object-cover
                      flex-shrink-0
                    "
                  />

                  {/* TEXT */}
                  <div className="flex flex-col text-left min-w-0">
                    <span className="text-white font-medium truncate">
                      {user.firstname}{" "}
                      {user.surname}
                    </span>

                    <span className="text-sm text-gray-400">
                      Личная переписка
                    </span>
                  </div>
                </button>
              );
            })}

          {!isLoading &&
            filteredUsers.length === 0 && (
              <div className="text-gray-500 text-center py-10">
                Пользователь не найден
              </div>
            )}
        </div>

        {/* ACTION */}
        <div className="mt-6">
          <button
            disabled={
              !selectedUserId ||
              createDirect.isPending
            }
            onClick={() => {
              if (!selectedUserId) return;

              createDirect.mutate({
                targetUserId: selectedUserId,
              });
            }}
            className="
              w-full py-3
              rounded-2xl
              bg-blue-600
              hover:bg-blue-500
              transition
              text-white font-medium
              disabled:opacity-50
              disabled:pointer-events-none
            "
          >
            {createDirect.isPending
              ? "Создание..."
              : "Создать чат"}
          </button>
        </div>
      </div>
    </div>
  );
}