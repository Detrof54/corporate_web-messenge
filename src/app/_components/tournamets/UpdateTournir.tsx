"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { TiebreakType } from "@prisma/client";
import { PerevodTiebreakType } from "./Tournir";

type Props = {
  idTournir: string;
  onClose: () => void;
  onCreated: () => void;
};

export default function UpdateTournir({
  idTournir,
  onClose,
  onCreated,
}: Props) {
  const utils = api.useUtils();

  const { data: tournir } =
    api.tournametsRouter.getTurnir.useQuery({ idTournir });

  const { data: allParticipants = [] } =
    api.tournametsRouter.getParticipants.useQuery();

  const mutation =
    api.tournametsRouter.updateTournir.useMutation({
      onSuccess: async () => {
        await utils.tournametsRouter.getTurnir.invalidate();
        onCreated();
        onClose();
      },
    });

  const [name, setName] = useState(tournir?.nameTurnir ?? "");
  const [description, setDescription] = useState(
    tournir?.description ?? ""
  );
  const [groupsCount, setGroupsCount] = useState(
    tournir?.groupsCount ?? 1
  );
  const [tiebreakType, setTiebreakType] = useState<TiebreakType>(
    tournir?.tiebreakType ?? TiebreakType.POINTS
  );
  const [selected, setSelected] = useState<string[]>(
    tournir?.participants.map((p) => p.id) ?? []
  );

  if (!tournir) return null;

  const toggleParticipant = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = () => {
    mutation.mutate({
      idTournir,
      nameTurnir: name,
      description,
      groupsCount: Number(groupsCount),
      tiebreakType
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white w-[900px] max-h-[90vh] rounded-2xl p-6 shadow-xl flex flex-col gap-6 overflow-y-auto">

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Редактирование турнира</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-800 p-3 rounded-xl"
          placeholder="Название турнира"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-gray-800 p-3 rounded-xl"
          placeholder="Описание"
        />

        <input
          type="number"
          value={groupsCount}
          onChange={(e) => setGroupsCount(Number(e.target.value))}
          className="bg-gray-800 p-3 rounded-xl"
          placeholder="Количество групп"
        />

        <select
          value={tiebreakType}
          onChange={(e) =>
            setTiebreakType(e.target.value as TiebreakType)
          }
          className="bg-gray-800 p-3 rounded-xl"
        >
          {Object.values(TiebreakType).map((type) => (
            <option key={type} value={type}>
              {PerevodTiebreakType(type) }
            </option>
          ))}
        </select>

        <button
          onClick={handleSubmit}
          className="ml-auto px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition"
        >
          Сохранить изменения
        </button>
      </div>
    </div>
  );
}