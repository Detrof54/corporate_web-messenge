"use client";

import { Card, CardContent } from "~/app/ui/card";
import { CalendarDays } from "lucide-react";
import { api } from "~/trpc/react";
import { Role, TiebreakType, TypeStage } from "@prisma/client";
import Group from "./Group/Group";
import Bracket from "./Bracket/Bracket";
import TableRezultTournir from "./TableRezultTournir";
import { useState } from "react";
import CreateTournirParticipants from "./CreateTournirParticipants";
import UpdateTournir from "./UpdateTournir";
import FormationGroup from "./Group/FormationGroup";
import CreateMatchsGrops from "./Group/CreateMatchsGrops";
import CreateRezultMatchsGrops from "./Group/CreateRezultMatchsGroups";
import FinishedGroupStage from "./Group/FinishedGroupStage";
import FormationBracket from "./Bracket/FormationBracket";
import CreateMatchRezultBracket from "./Bracket/CreateMatchRezultBracket";
import FinishedBracketStage from "./Bracket/FinishedBracketStage";

export function Perevod(type: TypeStage){
  if(type === TypeStage.GROUP)
    return "Групповой"
  else if(type === TypeStage.BRACKET)
    return "Плей-офф"
  else if(type === TypeStage.FINISHED)
    return "Завершенный"
  else 
    return "-"
}

export function PerevodTiebreakType(type: TiebreakType){
  if(type === TiebreakType.HEAD_TO_HEAD)
    return "результаты личных встреч"
  else if(type === TiebreakType.POINTS)
    return "по набранным очкам"
  else if(type === TiebreakType.SCORE_DIFF)
    return "разницы набранных и пропущенных голов"
  else 
    return "-"
}


export default function Tournir({role, idTournir, idUser}: {role: Role | undefined, idTournir: string, idUser: string | undefined}){

  const [open, setOpen] = useState<boolean>(false)
  const [open2, setOpen2] = useState<boolean>(false)

  const { data: tournir, isLoading, error, refetch } = api.tournametsRouter.getTurnir.useQuery({idTournir});
  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Error: {(error as any)?.message || "Ошибка"}</div>;
  if (!tournir) return <div>Нет информации о турнире</div>;

  const groups = tournir?.groups ?? [];
  const brackets = tournir?.brackets ?? [];

  const isAdminOrIsOrganizer = (role === Role.ADMIN || (role === Role.ORGANIZER && idUser === tournir.createdBy.id))
  
  return (
    <div className="flex flex-col gap-8 p-8 bg-gray-900 text-white">
      {isAdminOrIsOrganizer && (
        <button
          onClick={() => {
            if (groups.length ===0) setOpen2(true);
          }}
          disabled={groups.length !==0}
          className={`ml-auto px-5 py-2.5 rounded-xl font-medium shadow-md transition
            ${
              groups.length !==0
                ? "bg-gray-500 cursor-not-allowed opacity-60"
                : "bg-emerald-500 hover:bg-emerald-600 hover:shadow-lg active:scale-95"
            }
          `}
        >
          Обновить турнир
        </button>
      )}
      {open2 && (
        <UpdateTournir
          idTournir={idTournir}
          onClose={() => setOpen2(false)}
          onCreated={refetch}
        />
      )}
      <h2 className="text-3xl font-bold mb-4 text-center">{tournir.nameTurnir || "Турнир"}</h2>
      <div className="mb-2">
        <p className="text-xl text-gray-300">
          <span className="font-semibold">Описание:</span>{"  "}
          {tournir.description || "Без описания"}
        </p>
      </div>
      <div className="flex flex-col gap-2 mb-2">
            <ul className="text-lg text-gray-400 space-y-1 mb-3">
              <li><b className="text-gray-300">Организатор:</b> {(tournir.createdBy.surname && tournir.createdBy.firstname) ? (`${tournir.createdBy.surname} ${tournir.createdBy.firstname}`):"Без имени"}</li>
              <li><b className="text-gray-300">Текущий этап турнира:</b> {groups.length ===0 ? "Турнир еще не начался" : Perevod(tournir.stage)}</li>
              <li><b className="text-gray-300">Всего участников:</b> {tournir.participantsCount}</li>
              <li><b className="text-gray-300">Количество групп:</b> {tournir.groupsCount}</li>
              <li><b className="text-gray-300">Тай-брейк:</b> {PerevodTiebreakType(tournir.tiebreakType)}</li>
              <li><b className="text-gray-300">Дата создания:</b> {new Date(tournir.createdAt).toLocaleDateString("ru-RU")}</li>
              <li><b className="text-gray-300">Дата обновления:</b> {new Date(tournir.updatedAt).toLocaleDateString("ru-RU")}</li>
            </ul>
      </div>
      
      {isAdminOrIsOrganizer && (
        <button
          onClick={() => {
            if (groups.length ===0) setOpen(true);
          }}
          disabled={groups.length !==0}
          className={`mr-auto px-5 py-2.5 rounded-xl font-medium shadow-md transition
            ${
              groups.length !==0
                ? "bg-gray-500 cursor-not-allowed opacity-60"
                : "bg-emerald-500 hover:bg-emerald-600 hover:shadow-lg active:scale-95"
            }
          `}
        >
          Добавить участников турнира
        </button>
        )}
        {open && (
          <CreateTournirParticipants
            idTournir={idTournir}
            onClose={() => setOpen(false)}
            onCreated={refetch}
          />
        )}
        

      <h2 className="text-2xl font-bold mb-2 text-center">Групповой этап</h2>
      {isAdminOrIsOrganizer && 
        <FormationGroup idTournir={idTournir} participants={tournir.participants} groupsCount={tournir.groupsCount} groupsAlreadyCreated={groups.length > 0} onCreated={refetch} />
      }
      <Group groups={groups} />
      {isAdminOrIsOrganizer && <CreateMatchsGrops idTournir={idTournir} groups={tournir.groups} onCreated={refetch}/>}
      {isAdminOrIsOrganizer && <CreateRezultMatchsGrops idTournir={idTournir} groups={groups} onUpdated={refetch}/>}
      {isAdminOrIsOrganizer && <FinishedGroupStage idTournir={idTournir} groups={groups} stage={tournir.stage} onFinished={refetch}/>}

      <h2 className="text-2xl font-bold mb-2 mt-4 text-center">Этап на выбывание</h2>
      {(brackets.length <= 0 && isAdminOrIsOrganizer)  && <FormationBracket idTournir={idTournir} stage={tournir.stage} onCreated={refetch} totalParticipants={tournir.participantsCount} />}
      <Bracket brackets={brackets} />
      {isAdminOrIsOrganizer && <CreateMatchRezultBracket idTournir={idTournir} brackets={brackets} onUpdated={refetch}/>}
      {(isAdminOrIsOrganizer && tournir.stage !== "FINISHED" &&  tournir.stage !== "GROUP") && <FinishedBracketStage brackets={brackets} tournamentId={idTournir} onUpdated={refetch}/>}
      
      <h2 className="text-2xl font-bold mt-6 text-center">Общие результаты турнира</h2>
      <TableRezultTournir tournir={tournir} />
    </div>
  );
}