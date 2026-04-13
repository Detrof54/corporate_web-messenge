"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { TiebreakType } from "@prisma/client";

export default function CreateNewTournir({onClose,onCreated,}: {onClose: () => void;onCreated: () => void;}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [groupsCount, setGroupsCount] = useState("");
  const [tiebreakType, setTiebreakType] = useState<TiebreakType>("POINTS");

  const mutation = api.tournametsRouter.createTournament.useMutation({
    onSuccess: () => {
      onCreated();
    },
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-gray-800 p-6 rounded-xl w-[400px] space-y-4">
        <h2 className="text-xl font-bold text-white">
          Создание турнира
        </h2>

        <input
          type="text"
          placeholder="Название"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />

        <textarea
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="number"
          placeholder="Количество групп"
          value={groupsCount}
          onChange={(e) => setGroupsCount(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <p className="text-ml text-gray-300">Выберите тай-брейк</p>
        <select
          value={tiebreakType}
          onChange={(e) =>
            setTiebreakType(e.target.value as TiebreakType)
          }
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="POINTS">По очкам</option>
          <option value="HEAD_TO_HEAD">Личная встреча</option>
          <option value="SCORE_DIFF">Разница очков</option>
        </select>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
          >
            Отмена
          </button>

          <button
            onClick={() =>
              mutation.mutate({
                nameTurnir: name,
                description,
                groupsCount: Number(groupsCount) || 2,
                tiebreakType,
              })
            }
            disabled={mutation.isPending}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
          >
            Создать
          </button>
        </div>
      </div>
    </div>
  );
}