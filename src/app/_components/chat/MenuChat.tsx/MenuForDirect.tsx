"use client";

import { Trash2 } from "lucide-react";
import { api } from "~/trpc/react";

interface Props {
  chatId: string;
  onClose: () => void;
}

export function MenuForDirect({chatId,onClose}: Props) {

  const utils = api.useUtils();

  const deleteDirect = api.chats.deleteDirect.useMutation({
    onSuccess: () => {
      utils.chats.getChats.invalidate();
      onClose();
    },
  });

  return (
    <div className="flex flex-col gap-2">

      <button
        onClick={() =>
          deleteDirect.mutate({
            chatId,
          })
        }
        className="
          flex items-center gap-3
          px-4 py-3
          rounded-xl
          text-red-400
          hover:bg-gray-800
          transition
        "
      >
        <Trash2 size={18} />

        Удалить чат
      </button>

    </div>
  );
}