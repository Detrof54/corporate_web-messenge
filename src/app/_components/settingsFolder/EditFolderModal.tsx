"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface Props {
  folderId: string;
  currentName: string;
  onClose: () => void;
}

export function EditFolderModal({ folderId, currentName, onClose }: Props) {
  const [name, setName] = useState(currentName);

  const utils = api.useUtils();

  const updateFolder = api.settingFolder.updateFolderName.useMutation({
    onSuccess: () => {
      utils.settingFolder.getFolderList.invalidate();
      utils.settingFolder.getFolderChats.invalidate();
      utils.sidebar.getListFolders.invalidate()
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
          Редактировать папку
        </h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg outline-none mb-4"
        />

        <button
          onClick={() => updateFolder.mutate({ id: folderId, name })}
          disabled={!name.trim()}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
        >
          Сохранить
        </button>
      </div>
    </div>
  );
}