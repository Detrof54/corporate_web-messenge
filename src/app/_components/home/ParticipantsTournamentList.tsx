"use client";
import { api } from "~/trpc/react";
import SearchInput from "~/app/ui/searchInput";
import Pagination from "~/app/ui/pagination";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import ModalParticipant from "./ModalParticipant";
import { CreateParticipants } from "./CreateParticipants";
import { Role } from "@prisma/client";

type ParticipantType = {
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

export default function PatricipantTournamentList({role}:{role:Role|undefined}){

  const searchParams = useSearchParams()
  const query = searchParams.get("query")?.toLowerCase() || ""
  const currentPage = Number(searchParams.get("page")) || 1
  const itemsPerPage = 5

  const { data: participants, isLoading, error } = api.homeRouter.getParticipants.useQuery()
  const [participant, setParticipant] = useState<null | ParticipantType>(null)
  const [open, setOpen] = useState<boolean>(false)


  if (isLoading) return <p>Загрузка...</p>
  if (error) return <p>Ошибка загрузки</p>
  if (!participants || participants.length === 0)
    return <p>Нет участников</p>

  const filtered = participants.filter((p) => {
    const fullname = `${p.firstname} ${p.surname}`.toLowerCase()
    return fullname.includes(query)
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginated = filtered.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="flex flex-col items-center gap-8 p-8 bg-gray-900 text-white">
      {(role === Role.ADMIN || role === Role.ORGANIZER) && (open ? <CreateParticipants onCancel = {() => setOpen(false)}/> : (
        <button   
          onClick={() => {setOpen(true)}}
          className="
              ml-auto
              px-5 py-2.5
              rounded-xl
              bg-emerald-500
              text-white
              font-medium
              shadow-md
              hover:bg-emerald-600
              hover:shadow-lg
              active:scale-95
              transition
            " 
        > 
          Добавить участника 
        </button>
      ))}

      <h2 className="text-3xl font-bold mb-4 text-center">Участники турниров</h2>
      <SearchInput placeholder="Найти участника..." paramString="query" />
      <ul className="divide-y border rounded-md">
        {paginated.map((p) => (
          <li
            key={p.id}
            onClick={() => setParticipant(p)}
            className="grid grid-cols-3 gap-4 p-3 cursor-pointer hover:bg-gray-800"
          >
            <span className="text-sm text-gray-300">
              {p.firstname} {p.surname}
            </span>

            <span className="text-sm text-gray-300">
              Рейтинг: {p.rating}
            </span>

            <span className="text-sm text-gray-300">
              Туров: {p.tournaments.length}
            </span>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination totalPages={totalPages} />
        </div>
      )}

      {participant && (
        <ModalParticipant
          participant ={participant}
          onClose={() => setParticipant(null)}
          role = {role}
        />
      )}
    </div>
  );
}