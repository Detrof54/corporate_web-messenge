"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { ChatType } from "@prisma/client";
import { usePathname } from "next/navigation";
import { formatTime, getChatAvatar, getChatTitle, getPreview } from "~/lib/chat-utils";
import { useState } from "react";
import { MenuCreateChatModal } from "./ChatCreate/MenuCreateChatModal";
import { CreateChannelAndGroupModal } from "./ChatCreate/CreateChannelAndGroupModal";
import { CreateDirectChatModal } from "./ChatCreate/CreateDirectChatModal";

interface Props {
  userId?: string;
  folder_id?: string;
}

export function ChatsList({ userId, folder_id }: Props) {
  const [openMenuCreateChat, setOpenMenuCreateChat] = useState(false);
  const [createModalType, setCreateModalType] = useState<"GROUP" | "CHANNEL"| null>(null);
  const [openDirectModal, setOpenDirectModal] = useState(false);
  const [search, setSearch] = useState("");

  const pathname = usePathname();
  const { data, isLoading } = api.chats.getChats.useQuery({
    folderId: folder_id,
  });



  if (isLoading) {
    return (
      <div className="w-80 h-full bg-gray-800 p-3 text-gray-400"></div>
    );
  }

  const normalizedSearch = search.trim().toLowerCase();

  const filteredChats = data?.filter((chat) => {
    const title = getChatTitle(chat, userId);

    return title
      .toLowerCase()
      .includes(normalizedSearch);
  });

  return (
    <div className="w-80 h-full bg-gray-800 flex flex-col">
      
      {/* Верхняя панель с кнопкой добавления (чатов, групп, каналов) */}
      <div className="flex items-center justify-between px-3 py-3">
        <h1 className="text-white text-xl font-semibold">Чаты</h1>

        <button 
          onClick={() => setOpenMenuCreateChat(true)}
          className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-500 transition"
        >
          +
        </button>
      </div>

      {/* Поле поиска */}
      <div className="px-3 pb-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск"
          className="
            w-full bg-gray-700 text-white
            rounded-lg px-3 py-2 outline-none
          "
        />
      </div>

      {/* Отображение списка чатов */}
      <div className="flex flex-col gap-1 overflow-auto">
        {filteredChats?.map((chat) => {
          const lastMessage = chat.messages[0];

          const title = getChatTitle(chat, userId);
          const avatar = getChatAvatar(chat, userId);
          const preview = getPreview(lastMessage?.text);
          const time = formatTime(lastMessage?.createdAt);

          

          return (
            <Link
              key={chat.id}
              href={
                folder_id
                  ? `/folder/${folder_id}/chat/${chat.id}`
                  : `/chat/${chat.id}`
              }
              className={`flex items-center gap-3 p-2 rounded-lg transition
                ${
                  pathname.endsWith(`/chat/${chat.id}`) || pathname === `/chat/${chat.id}`
                    ? "bg-violet-500"
                    : "hover:bg-gray-700"
                }
              `}
            >
              {/* Аватарка */}
              <img
                src={avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />

              {/* Блок текста */}
              <div className="flex flex-col flex-1 min-w-0">
                
                {/* Название чата или имя фимилия собеседника */}
                <div className="flex justify-between items-center">
                  <span className="text-white text-sm font-medium truncate">
                    {title}
                  </span>

                  <span className="text-gray-500 text-xs ml-2 whitespace-nowrap">
                    {time}
                  </span>
                </div>

                {/* Последнее сообщение пользователя */}
                <span className={` text-xs truncate 
                  ${
                    pathname.endsWith(`/chat/${chat.id}`) || pathname === `/chat/${chat.id}`
                      ? "text-wite"
                      : "text-gray-400"
                  }` 
                }>
                  {preview}
                </span>
              </div>
            </Link>
          );
        })}
      </div>


      <MenuCreateChatModal
        open={openMenuCreateChat}
        onClose={() => setOpenMenuCreateChat(false)}
        onSelect={(type) => {

          setOpenMenuCreateChat(false);

          if (type === "channel") {
            setCreateModalType(ChatType.CHANNEL);
          }

          if (type === "group") {
            setCreateModalType(ChatType.GROUP);
          }
          if (type === "direct") {
            setOpenDirectModal(true);
          }
        }}
      />

      {createModalType && (
        <CreateChannelAndGroupModal
          open={!!createModalType}
          onClose={() => setCreateModalType(null)}
          TypeChat={createModalType}
        />
      )}

      <CreateDirectChatModal
        open={openDirectModal}
        onClose={() =>
          setOpenDirectModal(false)
        }
      />
    </div>
  );
}


