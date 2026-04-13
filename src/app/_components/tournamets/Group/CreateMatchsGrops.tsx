"use client";

import { api } from "~/trpc/react";
import type { Group } from "./Group";

type Props = {
  idTournir: string;
  groups: Group[];
  onCreated: () => void;
};

export default function CreateMatchsGrops({
  idTournir,
  groups,
  onCreated,
}: Props) {

  const matchesAlreadyCreated = groups.some(
    (g) => g.matches && g.matches.length > 0
  );

  const createMatches = api.tournametsRouter.createGroupMatches.useMutation({
    onSuccess: () => {
      onCreated();
    },
  });

  const handleCreateMatches = () => {
    if (matchesAlreadyCreated) return;

    createMatches.mutate({ idTournir });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-6">
      <h3 className="text-xl font-bold mb-4 text-center">
        Генерация матчей (каждый с каждым)
      </h3>

      <button
        onClick={handleCreateMatches}
        disabled={
          groups.length === 0 ||
          matchesAlreadyCreated ||
          createMatches.isPending
        }
        className={`w-full px-5 py-2.5 rounded-xl font-medium transition
          ${
            groups.length === 0 || matchesAlreadyCreated
              ? "bg-gray-500 cursor-not-allowed opacity-60"
              : "bg-emerald-500 hover:bg-emerald-600 active:scale-95"
          }
        `}
      >
        {matchesAlreadyCreated
          ? "Матчи уже созданы"
          : "Создать матчи"}
      </button>
    </div>
  );
}