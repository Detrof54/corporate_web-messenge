"use client";
import type { $Enums, RoleSystem } from "@prisma/client";
import Link from "next/link";
import { NavItem, NavItemBack } from "~/app/ui/NavItem";
import { ArrowLeft, Edit3, FolderMinus, MessageCircleX, MessageSquarePlus, MoreVertical } from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "~/app/ui/button";
import { getChatAvatar, getChatTitle } from "~/lib/chat-utils";
import { ChatType } from "@prisma/client";
import { useState } from "react";
import { AddChatModal } from "./AddChatModal";
import { EditFolderModal } from "./EditFolderModal";

interface Props {
  folderId: string;
  name: string;
  userId: string;
  onClose: () => void;
}

export function FolderModal({ folderId, name, userId, onClose }: Props) {
    const [openEdit, setOpenEdit] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);

    const utils = api.useUtils();
    const removeChat = api.settingFolder.removeChatFromFolder.useMutation({
        onSuccess: () => {
            utils.settingFolder.getFolderChats.invalidate();
        },
    });

    const deleteFolder = api.settingFolder.deleteFolder.useMutation({
        onSuccess: () => {
            onClose();
        },
    });

    const { data, isLoading } = api.settingFolder.getFolderChats.useQuery({
        id: folderId,
    });

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="w-full max-w-md bg-gray-900 rounded-2xl p-6 shadow-xl">
                <button onClick={onClose} className="flex text-gray-400 hover:text-white justify-self-end">
                    ✕
                </button>
                {/* HEADER */}
                <div className="grid grid-cols-[1fr,auto] gap-4 items-center mb-4 mt-5">
                    <div className="flex flex-col">
                        <h2 className="text-blue-400 text-xs font-semibold mb-1">
                        Название папки
                        </h2>
                        <h2 className="text-gray-200 text-lg font-semibold">
                        {name}
                        </h2>
                    </div>
                    <button onClick={() => setOpenEdit(true)} className="
                        flex flex-col items-center justify-center
                        w-1 h-1
                        rounded-2xl
                        transition-all duration-200
                        text-gray-500 hover:text-white hover:bg-gray-800">
                        <div className="text-xl"><Edit3 size={25}/></div>
                    </button>

                </div>

                {/* СПИСОК ЧАТОВ */}
                <div className="flex flex-col max-h-[400px] overflow-auto">
                    <h2 className="text-blue-400 text-xs font-semibold mb-2">
                        Чаты папки
                    </h2>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setOpenAdd(true)
                        }}
                        className="
                            flex items-center gap-3
                            w-full px-1 py-1
                            rounded-xl
                            transition-all duration-200
                            text-blue-400 hover:text-blue-200 hover:bg-gray-800
                        "
                    >
                        <MessageSquarePlus size={20} /> 
                        Добавить чат
                    </button>

                    {data?.folderChat.map((item) => {
                        const chat = item.chat;

                        return (
                        <div
                            key={chat.id}
                            className="flex items-center gap-3 p-3 rounded-xl"
                        >
                            {/* АВАТАР */}
                            <img
                                src={getChatAvatar(chat, userId)}
                                className="w-10 h-10 rounded-full object-cover"
                            />

                            {/* ТЕКСТ */}
                            <div className="flex flex-col">
                                <span className="text-white text-sm font-medium">
                                    {getChatTitle(chat, userId)}
                                </span>

                                <span className="text-xs text-gray-400">
                                    {chat.chatType === ChatType.DIRECT && "Личная переписка"}
                                    {chat.chatType === ChatType.GROUP && "Группа"}
                                    {chat.chatType === ChatType.CHANNEL && "Канал информации"}
                                </span>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeChat.mutate({
                                    folderId,
                                    chatId: chat.id,
                                    });
                                }}
                                className="text-red-400 hover:text-red-300 ml-auto"
                            >
                                <MessageCircleX size={20} />
                            </button>
                        </div>
                        );
                    })}

                    <button
                        onClick={(e) => {
                            e.stopPropagation(); 
                            deleteFolder.mutate({ id: folderId });
                        }}
                        className="
                            mt-5
                            flex items-center gap-3
                            w-full px-1 py-1
                            rounded-xl
                            transition-all duration-200
                            text-red-400 hover:text-red-400 hover:bg-gray-800
                        "
                    >
                        <FolderMinus size={20} /> 
                        Удалить папку
                    </button>
                </div>

            </div>

            {openAdd && (
                <AddChatModal
                    folderId={folderId}
                    userId={userId}
                    onClose={() => setOpenAdd(false)}
                />
            )}
            {openEdit && (
                <EditFolderModal
                    folderId={folderId}
                    currentName={name}
                    onClose={() => setOpenEdit(false)}
                />
            )}
        </div>
  );
}