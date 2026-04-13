"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { api } from "~/trpc/react";
import { Role } from "@prisma/client";
import Link from "next/link";

type ParticipantModalProps = {
  participant: {
    id: string;
    firstname: string;
    surname: string;
    rating: number;
    tournaments: {
      tournament: {
        id: string;
        nameTurnir: string;
      };
    }[];
  };
  onClose: () => void;
  role: Role | undefined;
};

export default function ModalParticipant({participant, onClose, role,}: ParticipantModalProps){
  const [isEdit, setIsEdit] = useState(false);

  const [firstname, setFirstname] = useState(participant.firstname);
  const [surname, setSurname] = useState(participant.surname);
  const [rating, setRating] = useState<number|"">(participant.rating);
  
  const utils = api.useUtils();
  const updateParticipant =
    api.homeRouter.updateParticipant.useMutation({
      onSuccess: async (updated) => {
        await utils.homeRouter.getParticipants.invalidate();
        setFirstname(updated.firstname);
        setSurname(updated.surname);
        setRating(updated.rating);
        setIsEdit(false);
      },
    });

  const deleteParticipant =
    api.homeRouter.deleteParticipant.useMutation({
      onSuccess: async () => {
        await utils.homeRouter.getParticipants.invalidate();
        onClose; 
      },
    });

  const handleUpdate = () => {
    updateParticipant.mutate({
      id: participant.id,
      firstname,
      surname,
      rating: rating === "" ? undefined : rating,
    });
  };

  const handleDelete = () => {
    if (!confirm("Удалить участника?")) return;
    deleteParticipant.mutate({ id: participant.id });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-lg ">
        <div className="mb-4 flex items-center justify-between">
          {isEdit ? (
            <div className="flex gap-2">
              <input
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="w-32 rounded border px-2 py-1 bg-gray-800"
              />
              <input
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="w-32 rounded border px-2 py-1 bg-gray-800"
              />
            </div>
          ) : (
            <h2 className="text-lg font-semibold ">
              {firstname} {surname}
            </h2>
          )}

          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-500 hover:text-black" />
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <span className="font-medium ">Рейтинг:</span>{" "}
            {isEdit ? (
              <input
                type="number"
                value={rating}
                onChange={(e) =>
                  setRating(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className="ml-2 w-24 rounded border px-2 py-1 bg-gray-800"
              />
            ) : (
              rating
            )}
          </div>

          <div>
            <span className="font-medium">Турниры:</span>
            {participant.tournaments.length === 0 ? (
              <p className="text-gray-500">Нет участий</p>
            ) : (
              <ul className="mt-1 list-inside list-disc">
                {participant.tournaments.map((tp) => (
                  <Link key={tp.tournament.id} href={`/tournaments/${tp.tournament.id}`} className="block">
                    <li key={tp.tournament.id}>
                      {tp.tournament.nameTurnir}
                    </li>
                  </Link>

                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          {(role === Role.ADMIN || role === Role.ORGANIZER) && (<button
            onClick={handleDelete}
            disabled={deleteParticipant.isPending}
            className="rounded-md bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 disabled:opacity-50"
          >
            Удалить
          </button>)}

          <div className="flex gap-2">
            {isEdit ? (
              <>
                <button
                  onClick={() => setIsEdit(false)}
                  className="            
                    px-4 py-2 rounded-lg
                    border border-red-300
                    text-red-600
                    hover:bg-red-100
                    transition"
                >
                  Отмена
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={updateParticipant.isPending}
                  className="rounded-md bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600 disabled:opacity-50"
                >
                  Сохранить
                </button>
              </>
            ) : (
              (role === Role.ADMIN || role === Role.ORGANIZER) && (<button
                onClick={() => setIsEdit(true)}
                className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
              >
                Редактировать
              </button>)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
