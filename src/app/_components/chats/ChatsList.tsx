"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { ChatType } from "@prisma/client";


interface Messages {
  id: string;
  createdAt: Date;
  chatId: string;
  text: string;
  updateAt: Date | null;
  senderId: string;
}
interface Members {
  user: {
    id: string;
    firstname: string | null;
    surname: string | null;
    image: string | null;
    patronymic: string | null;
  };
}
interface Chat {
  members: Members[];
  messages: Messages[];
  chatType: ChatType;
  id: string;
  name: string | null;
  image: string | null;
  createdAt: Date;
  description: string | null;
}

// функция для отображения названия чата (для групп и каналов просто название, для диалога имя и фамилия собеседника)
function getChatTitle(chat: Chat, userId?: string) {
  if (chat.chatType === ChatType.DIRECT) {
    const other = chat.members.find((m: Members) => m.user.id !== userId);
    return other
      ? `${other.user.firstname ?? ""} ${other.user.surname ?? ""}`.trim()
      : "Пользователь";
  }
  return chat.name ?? "Без названия";
}

// функция для аватарки пользователя/группы/канала (если нет то берутся по умолчанию)
function getChatAvatar(chat: Chat, userId?: string) {
  if (chat.chatType === ChatType.DIRECT) {
    const other = chat.members.find((m: Members) => m.user.id !== userId);
    return other?.user.image ?? "/default-avatar.jpg";
  }
  if (chat.chatType === ChatType.GROUP) {
    return chat.image ?? "/default_group_chat2.jpg";
  }
  if (chat.chatType === ChatType.CHANNEL) {
    return chat.image ?? "/default_chanel2.jpg";
  }
  return "/default-avatar.jpg";
}

//Ограничиваем длинну последнего сообщения показываемого у чата
function getPreview(text?: string) {
  if (!text) return "Нет сообщений";
  return text.length > 45 ? text.slice(0, 45) + "..." : text;
}

//функция для формирования времени в формате чч:мм
function formatTime(date?: Date) {
  if (!date) return "";
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}


interface Props {
  userId?: string;
  folder_id?: string;
}

export function ChatsList({ userId, folder_id }: Props) {
  const { data, isLoading } = api.chats.getChats.useQuery({
    folderId: folder_id,
  });

  if (isLoading) {
    return (
      <div className="w-80 h-full bg-gray-800 p-3 text-gray-400">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="w-80 h-full bg-gray-800 p-3 flex flex-col">
      
      {/* Верхняя панель с кнопкой добавления (чатов, групп, каналов) */}
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-white text-xl font-semibold">Чаты</h1>
        <button className="bg-blue-500 w-8 h-8 rounded-lg">+</button>
      </div>

      {/* Поле поиска */}
      <input
        placeholder="Поиск"
        className="bg-gray-700 text-white rounded-lg px-3 py-2 mb-3 outline-none"
      />

      {/* Отображение списка чатов */}
      <div className="flex flex-col gap-1 overflow-auto">
        {data?.map((chat) => {
          const lastMessage = chat.messages[0];

          const title = getChatTitle(chat, userId);
          const avatar = getChatAvatar(chat, userId);
          const preview = getPreview(lastMessage?.text);
          const time = formatTime(lastMessage?.createdAt);

          return (
            <Link
              key={chat.id}
              href={`/chat/${chat.id}`}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition"
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
                <span className="text-gray-400 text-xs truncate">
                  {preview}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}