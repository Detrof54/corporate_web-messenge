"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import type { TurnirParticipant } from "./Group";

type Props = {
  idTournir: string;
  participants: TurnirParticipant[];
  groupsCount: number;
  groupsAlreadyCreated: boolean;
  onCreated: () => void;
};

export default function FormationGroup({
  idTournir,
  participants,
  groupsCount,
  groupsAlreadyCreated,
  onCreated,
}: Props){
  const [error, setError] = useState<string | null>(null);
  const [groupNames, setGroupNames] = useState<string[]>(
    Array.from({ length: groupsCount }, () => "")
  );

  const createGroups = api.tournametsRouter.createGroups.useMutation({
    onSuccess: () => {
      onCreated();
    },
  });

  const handleCreateGroups = () => {
    if (groupsAlreadyCreated) return;

    setError(null);

    if (!participants || participants.length === 0) {
      setError("Нет участников для распределения");
      return;
    }

    if (participants.length < groupsCount * 2) {
      setError(
        "Недостаточно участников. В каждой группе должно быть минимум 2 человека."
      );
      return;
    }

    const shuffled = [...participants].sort(() => Math.random() - 0.5);

    const baseSize = Math.floor(shuffled.length / groupsCount);
    const remainder = shuffled.length % groupsCount;

    let startIndex = 0;

    const groupsData = Array.from({ length: groupsCount }).map((_, index) => {
      const size = baseSize + (index < remainder ? 1 : 0);
      const groupParticipants = shuffled.slice(startIndex, startIndex + size);
      startIndex += size;

      return {
        name: groupNames[index]?.trim()
          ? groupNames[index]
          : `Группа ${index + 1}`,
        participantIds: groupParticipants.map((p) => p.id),
      };
    });

    createGroups.mutate({
      idTournir,
      groups: groupsData,
    });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-6">
      <h3 className="text-xl font-bold mb-4 text-center">
        Формирование групп
      </h3>

      {groupsAlreadyCreated && (
        <div className="text-yellow-400 text-center mb-4">
          Группы уже сформированы
        </div>
      )}

      {Array.from({ length: groupsCount }).map((_, index) => (
        <div key={index} className="mb-3">
          <label className="text-gray-300 block mb-1">
            Название группы {index + 1}
          </label>
          <input
            type="text"
            disabled={groupsAlreadyCreated}
            value={groupNames[index]}
            onChange={(e) => {
              const updated = [...groupNames];
              updated[index] = e.target.value;
              setGroupNames(updated);
            }}
            className="w-full p-2 rounded bg-gray-700 text-white disabled:opacity-50"
            placeholder={`Группа ${index + 1}`}
          />
        </div>
      ))}

      {error && (
        <div className="text-red-400 mb-4 text-center">{error}</div>
      )}

      <button
        onClick={handleCreateGroups}
        disabled={
          groupsAlreadyCreated ||
          createGroups.isPending
        }
        className={`w-full mt-4 px-5 py-2.5 rounded-xl font-medium transition
          ${
            groupsAlreadyCreated
              ? "bg-gray-500 cursor-not-allowed opacity-60"
              : "bg-emerald-500 hover:bg-emerald-600 active:scale-95"
          }
        `}
      >
        {groupsAlreadyCreated
          ? "Группы уже созданы"
          : "Сформировать группы"}
      </button>
    </div>
  );
}