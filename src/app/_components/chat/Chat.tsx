"use client";

import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import { getChatTitle, getChatAvatar, formatTime, formatMessageDate } from "~/lib/chat-utils";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SideMenuChat } from "./MenuChat.tsx/SideMenuChat";
import { ChatRole, ChatType } from "@prisma/client";
import { useRef } from "react";
import { useEffect } from "react";
import { useSocket } from "~/providers/socket-provider";

export function Chat({ userId }: { userId: string | undefined}) {
  const { socket, onlineUsers } = useSocket();
  const [openMenu, setOpenMenu] = useState(false);
  const [localMessages, setLocalMessages] = useState<any[]>([]);    //сообщения
  const [messageText, setMessageText] = useState("");               //сообщение для отправки
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const params = useParams();
  const chatId = (params.chatId ?? params.id) as string;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const { data: messages, isLoading } = api.chats.getMessages.useQuery({ chatId,});
  useEffect(() => {
    if (messages) {
      setLocalMessages(messages);
    }
  }, [messages]);

  const { data: chat } = api.chats.getChatInfo.useQuery({chatId,});
  
  //подключение к комнате чата
  useEffect(() => {
    socket.emit("join_chat", chatId);

    return () => {
      socket.emit("leave_chat", chatId);
    };
  }, [chatId, socket]);

  useEffect(() => {
    socket.on("new_message", (message) => {
      setLocalMessages((prev) => {
        const exists = prev.some(
          (msg) => msg.id === message.id,
        );
        if (exists) return prev;
        const filtered = prev.filter(
          (msg) =>
            !(
              msg.pending &&
              msg.text === message.text &&
              msg.senderId === message.senderId
            ),
        );
        return [...filtered, message];
      });
    });
    return () => {
      socket.off("new_message");
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    const optimisticMessage = {
      id: crypto.randomUUID(),
      text: messageText,
      chatId,
      senderId: userId,
      createdAt: new Date(),
      pending: true,
      sender: {
        firstname: "You",
        surname: "",
        image: null,
      },
    };
    // МГНОВЕННОЕ ОБНОВЛЕНИЕ ПОЛЬЗОВАТЕЛЬСКОГО ИНТЕРФЕЙСА
    setLocalMessages((prev) => [
      ...prev,
      optimisticMessage,
    ]);
    // ОТПРАВИТЬ НА СЕРВЕР
    socket.emit("send_message", {
      chatId,
      text: messageText,
    });
    setMessageText("");
  };



  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  if (isLoading) {
    return <div className="flex-1 bg-gray-900 text-white p-4"></div>;
  }

  const UserCurrent = chat?.members.find((member) => userId === member.user.id)

  const isGroup = chat?.chatType === "GROUP"
  const interlocutorId = chat?.chatType === ChatType.DIRECT ? chat.members.find(m => m.user.id !== userId)?.user.id : undefined;

  const isOnline = interlocutorId && onlineUsers.has(interlocutorId);

  const RightToPublic = (chat?.chatType !== ChatType.CHANNEL || UserCurrent?.role === ChatRole.OWNER 
    || UserCurrent?.role === ChatRole.ADMIN)

  return (
    <div className="flex flex-col flex-1 bg-gray-900">

      {/* Заголовок */}
      <div className="h-14 border-b border-gray-800 flex items-center px-4">
        <div className="h-14 w-full border-b border-gray-800 flex items-center px-4 gap-3">
          {chat && (
            <Link
              href={
                chat?.chatType === ChatType.DIRECT && interlocutorId
                  ? `/profile/${interlocutorId}`
                  : `/profileGroupOrChannel/${chat.id}`
              }
              className="flex items-center gap-3"
            >
              <img
                src={getChatAvatar(chat, userId)}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex flex-col">
                <span className="text-white font-semibold">
                  {getChatTitle(chat, userId)}
                </span>

                {chat?.chatType === ChatType.DIRECT && (
                  <span
                    className={`text-xs ${
                      isOnline
                        ? "text-purple-400"
                        : "text-gray-400"
                    }`}
                  >
                    {isOnline ? "в сети" : "не в сети"}
                  </span>
                )}
              </div>
            </Link>
          )}
        </div>
        <button
          onClick={() => setOpenMenu(true)}
          className="p-2 rounded-lg hover:bg-gray-700"
        >
          <MoreVertical size={20} />
        </button>
      </div>

      {/* ЦЕНТРАЛЬНАЯ ОБЛАСТЬ */}
      <div className="flex justify-center flex-1 overflow-hidden">
        <div className="flex flex-col w-full max-w-2xl">

          {/* СООБЩЕНИЯ */}
          <div className="flex-1 overflow-auto p-4 flex flex-col gap-2">
            {localMessages?.map((msg, index) => {
              const isMine = msg.senderId === userId;

              const prev = localMessages[index - 1];
              const next = localMessages[index + 1];

              const isFirstInGroup = prev?.senderId !== msg.senderId;
              const isLastInGroup = next?.senderId !== msg.senderId;

              const currentDate = new Date(msg.createdAt);

              const prevMessage = localMessages[index - 1];

              const prevDate = prevMessage
                ? new Date(prevMessage.createdAt)
                : null;

              const isNewDay =
                !prevDate ||
                currentDate.toDateString() !== prevDate.toDateString();

              return (

              <div key={msg.id}>
                {isNewDay && (
                  <div className="flex justify-center my-4">
                    <div
                      className="
                        bg-gray-800/90
                        text-gray-300
                        text-xs
                        px-3 py-1
                        rounded-full
                        backdrop-blur
                      "
                    >
                      {formatMessageDate(currentDate)}
                    </div>
                  </div>
                )}
                <div
                  
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
                          
                        ${msg.pending ? "opacity-70" : ""}
                      `}
                    >
                      {!isMine && isGroup && isFirstInGroup && (
                        <span className="block text-sm text-violet-500 mb-0">
                          {msg.sender.firstname} {msg.sender.surname}
                        </span>
                      )}

                      <div className="break-words">
                        {msg.text}

                        <span
                          className="
                            float-right
                            ml-2
                            mt-2
                            text-[11px]
                            text-gray-300
                            leading-none
                            whitespace-nowrap
                          "
                        >
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Строка ввода */}
          {RightToPublic &&
            <div className="h-14 border-t border-gray-800 flex items-center gap-2 px-3">
              <input
                value={messageText}
                onChange={(e) =>
                  setMessageText(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
                placeholder="Сообщение"
                className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="bg-purple-500 w-10 h-10 rounded-full"
              >
                ↑
              </button>
            </div>
          }

        </div>
      </div>
      {/* боковое меню чата */}
      <SideMenuChat
        open={openMenu}
        onClose={() => setOpenMenu(false)}
        typeChat={chat?.chatType}
        chatId={chatId}
      />
    </div>
  );
}

