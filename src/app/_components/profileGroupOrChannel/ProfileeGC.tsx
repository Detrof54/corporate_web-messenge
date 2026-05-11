"use client";

import { DateFromFormate } from "~/lib/clear-format";
import { ArrowLeft, MessageSquarePlus, Pencil } from "lucide-react";
import { DeleteGC } from "./DeleteGC";
import { ChatRole, ChatType, RoleSystem } from "@prisma/client";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { AddMembersGCModal } from "./AddMembersGCModal";
import { DeleteMembersGCModal } from "./DeleteMembersGCModal";
import { RoleLabel } from "~/lib/utils";

export interface User{ 
  id: string; image: string | null; 
  firstname: string | null; 
  surname: string | null; 
  patronymic: string | null; 
  email: string | null; 
  role: RoleSystem; 
} 
export interface Member{ 
  id: string, 
  user: User, 
  role: ChatRole, 
} 
export interface Chat{ 
  id: string, name: string | null; 
  image: string | null; 
  createdAt: Date; 
  description: string | null; 
  chatType: ChatType; members: Member[], 
}

interface Props {
  chatId: string;
  currentUserId?: string;
}

//Права на редактирование/удаление группы/канала
function RightToGroupOrChannel(chat: Chat | undefined, currentUserId?: string){
  if(!chat)
    return false
  const memberCurrent = chat.members.find((member: Member) => member.user.id === currentUserId)
  if (memberCurrent?.role === ChatRole.OWNER || memberCurrent?.role === ChatRole.ADMIN)
    return true
  return false
}

export function ProfileGC({ chatId, currentUserId }: Props){
  const {data: chat, isLoading,} = api.profileGC.getGroupChannelInfo.useQuery({id: chatId,});

  const [openDeleteMembers, setOpenDeleteMembers] = useState(false);
  const [openAddMembers, setOpenAddMembers] = useState(false);
  const [modeUpdate, setModeUpdate] = useState<boolean>(false)
  const [name, setName] = useState(chat?.name ?? "");
  const [description, setDescription] = useState(chat?.description ?? "");

  const [memberRoles, setMemberRoles] = useState<Record<string, ChatRole>>({});

  useEffect(() => {
    if (chat) {
      setName(chat.name ?? "");
      setDescription(chat.description ?? "");
      
      const roles: Record<string, ChatRole> = {};
      chat.members.forEach((member) => {
        roles[member.user.id] = member.role;
      });

      setMemberRoles(roles);
    }
  }, [chat]);

  const utils = api.useUtils();
  const updateChat = api.profileGC.updateGroupChannel.useMutation({
      onSuccess: async () => {
        await utils.profileGC.getGroupChannelInfo.invalidate(
          {
            id: chat?.id,
          }
        );
        setModeUpdate(false);
      },
    });

  const Right = RightToGroupOrChannel(chat, currentUserId)
  
  if (isLoading || !chat) 
    return <div className="text-white"></div>
    
  return (
    <div className="h-screen overflow-y-auto bg-gray-950 px-4 py-6">
      <div className="min-h-full flex items-start justify-center">
        <div className="w-full max-w-3xl bg-gray-900 rounded-3xl p-6 flex flex-col gap-6 flex-shrink-0">

          {/* ЗАГОЛОВОК */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-2xl min-h-[180px]">

              {/* Кнопка выхода из режма редактирования */}
              <div className="absolute left-0 top-0">
                {modeUpdate && (
                  <button
                    onClick={() => setModeUpdate(false)}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-800 hover:bg-gray-700 transition"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
              </div>

              {/* ЦЕНТР заголовка */}
              <div className="flex flex-col items-center px-16">
                <img
                  src={chat.image ?? (chat.chatType === ChatType.CHANNEL ? "/default_chanel2.jpeg" : "/default_group_chat2.jpeg")}
                  className="w-28 h-28 rounded-full object-cover border-4 border-gray-800 flex-shrink-0"
                />

                {!modeUpdate ? (
                  <h1 className=" text-2xl font-bold text-white mt-4 text-center break-words min-h-[36px] w-full">
                    {chat.name}
                  </h1>
                ) : (
                  <div className="w-full flex justify-center mt-4">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full max-w-md text-xl bg-gray-800 text-white rounded-2xl px-4 py-2 outline-none text-center"
                    />
                  </div>
                )}
                <span className="text-gray-400 mt-2">
                  {chat.chatType === "GROUP" ? "Группа" : "Канал"}
                </span>
              </div>

              {/* Кнопка для входа в режим редактирования */}
              <div className="absolute right-0 top-0">
                {!modeUpdate && Right && (
                  <button
                    onClick={() => setModeUpdate(true)}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-800 hover:bg-gray-700 transition"
                  >
                    <Pencil size={20} />
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* ОПИСАНИЕ */}
          {!modeUpdate ? (
            <div className="bg-gray-800 rounded-2xl p-4">
              <div className="text-sm text-gray-400 mb-2">
                Описание
              </div>
              <div className="text-white whitespace-pre-wrap break-words">
                {chat.description || "Описание отсутствует"}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-sm text-gray-400 mb-2">
                Описание
              </div>
              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                rows={4}
                className="w-full bg-gray-800 text-white rounded-2xl px-4 py-3 outline-none resize-none "
              />
            </div>
          )}

          {/* Доп информаци о канале/чате */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-2xl p-4">
              <div className="text-sm text-gray-400 mb-1">
                Дата создания
              </div>
              <div className="text-white">
                {DateFromFormate(chat.createdAt)}
              </div>
            </div>
            <div className="bg-gray-800 rounded-2xl p-4">
              <div className="text-sm text-gray-400 mb-1">
                Участников
              </div>
              <div className="text-white">
                {chat.members.length}
              </div>
            </div>
          </div>

          {/* Список участников группы/канала */}
          <div className="min-h-0 flex flex-col">
            <div className="text-lg text-white font-semibold mb-1 text-center">
              Участники
            </div>
            {(!modeUpdate && Right) && (
              <button
                onClick={() => setOpenAddMembers(true)}
                className="
                  flex items-center gap-3 w-full px-1 py-1
                  rounded-xl transition-all duration-200
                  text-blue-400 hover:text-blue-200
                  justify-center
                "
              >
                Добавить участников
              </button>
            )}
            <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-2">
              {chat.members.map((member) => (
                <div
                  key={member.id}
                  className="bg-gray-800 rounded-2xl p-3 flex items-center gap-3 min-w-0"
                >
                  <img
                    src={
                      member.user.image ??
                      "/default-avatar.jpg"
                    }
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />

                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-white truncate">
                      {member.user.firstname}{" "}{member.user.surname}
                    </span>
                    <span className="text-sm text-gray-400 truncate">
                      {member.user.email}
                    </span>
                  </div>

                  {!modeUpdate || member.role === ChatRole.OWNER ? (
                    <div className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-sm whitespace-nowrap">
                      {RoleLabel(
                        memberRoles[member.user.id] ?? member.role
                      )}
                    </div>
                    ) : (
                    <select
                      value={
                        memberRoles[member.user.id] ?? member.role
                      }
                      onChange={(e) => {
                        setMemberRoles((prev) => ({
                          ...prev,
                          [member.user.id]:
                            e.target.value as ChatRole,
                        }));
                      }}
                      className=" bg-gray-700 text-white rounded-xl px-3 py-2 text-sm outline-none"
                    >
                      <option value={ChatRole.USER}>
                        Участник
                      </option>
                      <option value={ChatRole.ADMIN}>
                        Администратор
                      </option>
                    </select>
                  )}
                </div>
              ))}
            </div>

            {(!modeUpdate && Right) && (
              <button
                onClick={() => setOpenDeleteMembers(true)}
                className="
                  flex items-center gap-3
                  w-full px-1 py-1 rounded-xl
                  transition-all duration-200
                  text-red-400 hover:text-red-200
                  justify-center
                "
              >
                Удалить участников
              </button>
            )}
          </div>

          {(modeUpdate && Right) && (
            <button
              disabled={!name.trim()}
              onClick={() => {
                updateChat.mutate({
                  chatId: chat.id,
                  name,
                  description,

                  memberRoles: Object.entries(memberRoles).map(
                    ([userId, role]) => ({
                      userId,
                      role,
                    })
                  ),
                });
              }}
              className="
                py-3 rounded-2xl bg-violet-600 hover:bg-violet-500
                transition text-white disabled:opacity-50
              "
            >
              Сохранить
            </button>
          )}

          {(modeUpdate && Right) && (
            <DeleteGC chatId={chat.id} />
          )}
        </div>
      </div>

      <AddMembersGCModal
        open={openAddMembers}
        onClose={() => setOpenAddMembers(false)}
        chatId={chat.id}
        existingMemberIds={chat.members.map((m) => m.user.id)}
      />
      
      <DeleteMembersGCModal
        open={openDeleteMembers}
        onClose={() => setOpenDeleteMembers(false)}
        chatId={chat.id}
        members={chat.members}
      />
    </div>
  );
}