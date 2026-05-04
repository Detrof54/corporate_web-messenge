"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface Props {
  userId: string;
  onClose: () => void;
}

export function CreateFolderModal({ userId, onClose }: Props) {
  const [name, setName] = useState("");
  const utils = api.useUtils();

  const createFolder = api.settingFolder.createFolder.useMutation({
    onSuccess: () => {
      utils.settingFolder.getFolderList.invalidate();
      onClose();
    },
  });

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
          Создать папку
        </h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Название папки"
          autoFocus
          className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg outline-none mb-4"
        />

        <button
          onClick={() => createFolder.mutate({ userId, name })}
          disabled={!name.trim()}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
        >
          Создать
        </button>
      </div>
    </div>
  );
}