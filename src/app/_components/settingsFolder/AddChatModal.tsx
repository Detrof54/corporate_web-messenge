"use client";

import { api } from "~/trpc/react";
import { getChatAvatar, getChatTitle } from "~/lib/chat-utils";
import { ChatType } from "@prisma/client";

interface Props {
  folderId: string;
  userId: string;
  onClose: () => void;
}

export function AddChatModal({ folderId, userId, onClose }: Props) {
  const utils = api.useUtils();

  const { data: allChats } = api.settingFolder.getUserChats.useQuery({
    userId,
  });

  const { data: folderData } = api.settingFolder.getFolderChats.useQuery({
    id: folderId,
  });

  const addChat = api.settingFolder.addChatToFolder.useMutation({
    onSuccess: () => {
      utils.settingFolder.getFolderChats.invalidate();
      onClose()
    },
  });
  
  // ФИЛЬТР
  const folderChatIds = new Set(
    folderData?.folderChat.map((f) => f.chat.id)
  );

  const availableChats = allChats?.filter(
    (chat) => !folderChatIds.has(chat.id)
  );

    if (!allChats || !folderData) {
        return <div className="text-white p-4">Загрузка...</div>;
    }
    return (
        <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={onClose}
        >
        <div
            className="w-full max-w-md bg-gray-900 rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
        >
            <h2 className="text-white text-lg mb-4">
            Добавить чат
            </h2>

            <div className="flex flex-col gap-2 max-h-[400px] overflow-auto">

            {availableChats?.map((chat) => (
                <div
                key={chat.id}
                onClick={() =>
                    addChat.mutate({
                    folderId,
                    chatId: chat.id,
                    })
                }
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 cursor-pointer"
                >
                <img
                    src={getChatAvatar(chat, userId)}
                    className="w-10 h-10 rounded-full"
                />

                <div>
                    <div className="text-white text-sm">
                    {getChatTitle(chat, userId)}
                    </div>

                    <div className="text-xs text-gray-400">
                    {chat.chatType === ChatType.DIRECT && "Личная переписка"}
                    {chat.chatType === ChatType.GROUP && "Группа"}
                    {chat.chatType === ChatType.CHANNEL && "Канал"}
                    </div>
                </div>
                </div>
            ))}

            {availableChats?.length === 0 && (
                <div className="text-gray-400 text-center">
                Все чаты уже добавлены
                </div>
            )}

            </div>
        </div>
        </div>
    );
}