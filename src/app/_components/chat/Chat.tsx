"use client";

import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import { getChatTitle, getChatAvatar } from "~/lib/chat-utils";


export function Chat({ userId }: { userId: string | undefined}) {
  const params = useParams();
  const chatId = (params.chatId ?? params.id) as string;
  
  const { data: messages, isLoading } = api.chats.getMessages.useQuery({
    chatId,
  });
  const { data: chat } = api.chats.getChatInfo.useQuery({
    chatId,
  });

  if (isLoading) {
    return <div className="flex-1 bg-gray-900 text-white p-4">Загрузка...</div>;
  }

  const isGroup = chat?.chatType === "GROUP"

  return (
    <div className="flex flex-col flex-1 bg-gray-900">

      {/* Заголовок */}
      <div className="h-14 border-b border-gray-800 flex items-center px-4">
        <div className="h-14 w-full border-b border-gray-800 flex items-center px-4 gap-3">
          {chat && (
            <>
              <img
                src={getChatAvatar(chat, userId)}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-white font-semibold">
                {getChatTitle(chat, userId)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* ЦЕНТРАЛЬНАЯ ОБЛАСТЬ */}
      <div className="flex justify-center flex-1 overflow-hidden">
        <div className="flex flex-col w-full max-w-2xl">

          {/* СООБЩЕНИЯ */}
          <div className="flex-1 overflow-auto p-4 flex flex-col gap-2">
            {messages?.map((msg, index) => {
              const isMine = msg.senderId === userId;

              const prev = messages[index - 1];
              const next = messages[index + 1];

              const isFirstInGroup = prev?.senderId !== msg.senderId;
              const isLastInGroup = next?.senderId !== msg.senderId;

              return (
                <div
                  key={msg.id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"} gap-2`}
                >
                  {/* АВАТАР (только для групп и только у последнего сообщения) */}
                  {!isMine && isGroup && (
                    <div className="w-8 flex items-end">
                      {isLastInGroup && (
                        <img
                          src={msg.sender.image ?? "/default-avatar.jpg"}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                    </div>
                  )}

                  <div className="flex flex-col max-w-xs">

                    {/* СООБЩЕНИЕ */}
                    <div
                      className={`
                        px-3 py-2 rounded-xl text-sm
                        ${isMine
                          ? "bg-purple-500 text-white"
                          : "bg-gray-700 text-white"}
                      `}
                    >
                      {!isMine && isGroup && isFirstInGroup && (
                        <span className="block text-sm text-violet-500 mb-0">
                          {msg.sender.firstname} {msg.sender.surname} 
                        </span>
                      )}
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Строка ввода */}
          <div className="h-14 border-t border-gray-800 flex items-center gap-2 px-3">
            <input
              placeholder="Сообщение"
              className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg outline-none"
            />
            <button className="bg-purple-500 w-10 h-10 rounded-full">
              ↑
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}