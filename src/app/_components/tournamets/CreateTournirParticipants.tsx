"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

type Props = {
  idTournir: string;
  onClose: () => void;
  onCreated: () => void;
};

export default function CreateTournirParticipants({idTournir,onClose,onCreated}: Props) {
  const utils = api.useUtils();

  const { data: participants = [], isLoading } =
    api.tournametsRouter.getParticipants.useQuery();

  const createMutation =
    api.tournametsRouter.createTurnirParticipant.useMutation({
      onSuccess: async () => {
        await utils.tournametsRouter.getTurnir.invalidate();
        onCreated();
        onClose();
      },
    });

  const [selected, setSelected] = useState<string[]>([]);

  const available = participants.filter(
    (p) => !selected.includes(p.id)
  );

  const handleAdd = (id: string) => {
    setSelected((prev) => [...prev, id]);
  };

  const handleRemove = (id: string) => {
    setSelected((prev) => prev.filter((x) => x !== id));
  };

  const handleSubmit = () => {
    if (selected.length === 0) return;

    createMutation.mutate({
      idTournir,
      idParcipants: selected,
    });
  };

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white w-[800px] max-h-[90vh] rounded-2xl p-6 shadow-xl flex flex-col gap-6">
        
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            Добавление участников
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-6 flex-1 overflow-hidden">

          <div className="flex-1 border border-gray-700 rounded-xl p-4 overflow-y-auto">
            <h3 className="mb-3 font-semibold text-gray-300">
              Доступные участники
            </h3>

            <div className="flex flex-col gap-2">
              {available.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center bg-gray-800 px-3 py-2 rounded-lg"
                >
                  <span>
                    {p.surname} {p.firstname}
                  </span>
                  <button
                    onClick={() => handleAdd(p.id)}
                    className="text-emerald-400 hover:text-emerald-300"
                  >
                    ➕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 border border-gray-700 rounded-xl p-4 overflow-y-auto">
            <h3 className="mb-3 font-semibold text-gray-300">
              Выбранные
            </h3>

            <div className="flex flex-col gap-2">
              {participants
                .filter((p) => selected.includes(p.id))
                .map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center bg-gray-800 px-3 py-2 rounded-lg"
                  >
                    <span>
                      {p.surname} {p.firstname}
                    </span>
                    <button
                      onClick={() => handleRemove(p.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ➖
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={createMutation.isPending || selected.length === 0}
          className="ml-auto px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 transition"
        >
          {createMutation.isPending ? "Сохранение..." : "Сохранить"}
        </button>
      </div>
    </div>
  );
}