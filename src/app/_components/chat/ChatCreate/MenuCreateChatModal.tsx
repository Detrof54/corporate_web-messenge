"use client";

import {ChevronRight, Megaphone, MessageCirclePlus, Users} from "lucide-react";

interface Props{
  open: boolean;
  onClose: () => void;
  onSelect?: (type: "channel" | "group" | "direct") => void;
}

export function MenuCreateChatModal({ open, onClose, onSelect}: Props) {

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 " onClick={onClose}>
      <div
        className="w-full max-w-sm bg-gray-900 rounded-2xl p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        
        <button
          onClick={onClose}
          className="flex text-gray-400 hover:text-white justify-self-end mb-3"
        >
          ✕
        </button>

        <div className="flex flex-col gap-2">

          <button
            onClick={() => onSelect?.("channel")}
            className="
              flex items-center gap-3
              w-full px-4 py-3
              rounded-xl
              transition-all duration-200
              text-gray-300 hover:text-white hover:bg-gray-800
            "
          >
            <Megaphone size={20} />
            Создать канал информации
            <ChevronRight size={16} className="ml-auto opacity-60" />
          </button>

          <button
            onClick={() => onSelect?.("group")}
            className="
              flex items-center gap-3
              w-full px-4 py-3
              rounded-xl
              transition-all duration-200
              text-gray-300 hover:text-white hover:bg-gray-800
            "
          >
            <Users size={20} />
            Создать группу
            <ChevronRight size={16} className="ml-auto opacity-60" />
          </button>

          <button
            onClick={() => onSelect?.("direct")}
            className="
              flex items-center gap-3
              w-full px-4 py-3
              rounded-xl
              transition-all duration-200
              text-gray-300 hover:text-white hover:bg-gray-800
            "
          >
            <MessageCirclePlus size={20} />
            Создать личный чат
            <ChevronRight size={16} className="ml-auto opacity-60" />
          </button>

        </div>
      </div>
    </div>
  );
}