"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";

interface Props {
  chatId: string;
}

export function DeleteGC({chatId,}: Props) {
  const router = useRouter();

  const utils = api.useUtils();

  const deleteChat = api.profileGC.deleteGroupChannel.useMutation({
      onSuccess: async () => {

        await utils.chats.getChats.invalidate();

        router.push("/");
      },
    });

  return (
    <button
      onClick={() =>
        deleteChat.mutate({
          chatId,
        })
      }
      className="
          flex flex-col items-center justify-center
          w-30 h-16 rounded-2xl transition-all duration-200
          text-red-500 hover:text-white hover:bg-gray-800"
    >
      <div className="text-xl"><Trash2 size={25} color="red"/></div>
      <span className="text-xs font-medium">Удалить профиль</span>
    </button>
  );
}