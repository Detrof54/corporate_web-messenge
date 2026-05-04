"use client";
import type { $Enums, RoleSystem } from "@prisma/client";
import Link from "next/link";
import { NavItem, NavItemBack } from "~/app/ui/NavItem";
import { ArrowLeft, FolderPlus, MoreVertical } from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "~/app/ui/button";
import { useState } from "react";
import { FolderModal } from "./FolderModal";
import { CreateFolderModal } from "./CreateFolderModal";


export function FolderList({ userId }: { userId: string }) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [openCreate, setOpenCreate] = useState(false);

  const { data, isLoading } = api.settingFolder.getFolderList.useQuery({
    id: userId,
  });
  const selectedFolder = data?.folder.find(
    (f) => f.id === selectedFolderId
  );

  if (isLoading) {
    return <div className="text-white p-4">Загрузка...</div>;
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl shadow-2xl flex flex-col gap-3">
        <div className="mt-2 flex justify-start">
          <NavItemBack
              href={`/settings/`}
              icon={<ArrowLeft size={30} />}
          />
        </div> 
      <h2 className="text-2xl font-bold text-white text-center mb-2">
        Папки с чатами
      </h2>

      <button
        onClick={(e) => {
            e.stopPropagation()
            setOpenCreate(true)
        }}
        className="
            flex items-center gap-3
            w-full px-1 py-1
            rounded-xl
            transition-all duration-200
            text-blue-400 hover:text-blue-200 hover:bg-gray-800
        "
        >
            <FolderPlus size={20} /> 
            Создать папку
        </button>

      {data?.folder.map((folder) => (
        <div
          key={folder.id}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 transition"
        >
          {/* Клик по папке */}
          <div
            className="flex flex-col text-left cursor-pointer flex-1"
            onClick={() => setSelectedFolderId(folder.id)}
          >
            <span className="text-white font-medium">
              {folder.name}
            </span>
            <span className="text-xs text-gray-400">
              {folder.folderChat.length} {folder.folderChat.length === 1 ? "чат" : (folder.folderChat.length === 2 ? "чата" : "чатов")}
            </span>
          </div>



          {/* Кнопка меню */}
          <button
            onClick={(e) => {
              e.stopPropagation(); 
              console.log("Открыть меню");
            }}
            className="p-2 rounded-lg hover:bg-gray-700"
          >
            <MoreVertical size={20} />
          </button>
        </div>
      ))}

      {openCreate && (
        <CreateFolderModal
          userId={userId}
          onClose={() => setOpenCreate(false)}
        />
      )}          
      {selectedFolder && (
        <FolderModal
          folderId={selectedFolder.id}
          name={selectedFolder.name}
          userId={userId}
          onClose={() => setSelectedFolderId(null)}
        />
      )}
    </div>
  );
}