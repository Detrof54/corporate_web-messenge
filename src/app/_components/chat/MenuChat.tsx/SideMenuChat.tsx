"use client";

import { ChatType } from "@prisma/client";

import { MenuForDirect } from "./MenuForDirect";

interface Props {
  open: boolean;
  onClose: () => void;

  typeChat?: ChatType;

  chatId: string;
}

export function SideMenuChat({
  open,
  onClose,
  typeChat,
  chatId,
}: Props) {

  if (!open) return null;

  return (
    <>

      {/* OVERLAY */}
      <div
        className="
          fixed inset-0 z-40
          bg-black/40
        "
        onClick={onClose}
      />

      {/* MENU */}
      <div
        className="
          fixed top-0 right-0 z-50
          h-full w-80
          bg-gray-900
          border-l border-gray-800
          p-4
          shadow-2xl
        "
      >

        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">

          <h2 className="text-white text-lg font-semibold">
            Меню чата
          </h2>

          <button
            onClick={onClose}
            className="
              text-gray-400
              hover:text-white
            "
          >
            ✕
          </button>

        </div>

        {/* DIRECT */}
        {typeChat === ChatType.DIRECT && (
          <MenuForDirect
            chatId={chatId}
            onClose={onClose}
          />
        )}

      </div>
    </>
  );
}