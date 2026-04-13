"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { MatchStatus } from "@prisma/client";
import type { Group, GroupMatch } from "./Group";

export default function CreateRezultMatchsGrops({groups,onUpdated,idTournir,}: {groups: Group[],onUpdated: () => void, idTournir: string;}) {

  const [openGroupIds, setOpenGroupIds] = useState<string[]>([]);
  const setResult = api.tournametsRouter.setMatchResult.useMutation({
    onSuccess: () => onUpdated()
  });

  return (
    <div className="space-y-8 mt-6">

      {groups.map(group => {
        const unfinishedMatches = group.matches
          ?.filter(m => m.status === MatchStatus.SCHEDULED)
          .sort((a,b) => a.round - b.round) ?? [];

        if (!unfinishedMatches.length) {
          return (
            <div key={group.id}>
              <h3 className="text-xl font-bold">{group.name}</h3>
              <p>Все матчи группы завершены</p>
            </div>
          );
        }

        const currentRound = Math.min(...unfinishedMatches.map(m => m.round));

        const matchesRound = unfinishedMatches.filter(m => m.round === currentRound);

        const isOpen = openGroupIds.includes(group.id);

        return (
          <div key={group.id} className="bg-gray-900 p-6 rounded-xl">

            <h3 className="text-xl font-bold mb-3">
              Группа {group.name} — Тур {currentRound}
            </h3>

            <button
              onClick={() => {
                setOpenGroupIds(prev =>
                  prev.includes(group.id)
                    ? prev.filter(id => id !== group.id)
                    : [...prev, group.id]
                );
              }}
              className="px-4 py-2 bg-emerald-500 rounded mb-4"
            >
              {isOpen ? "Скрыть" : "Ввести результаты"}
            </button>

            {isOpen && matchesRound.map(match => (
              <MatchRow
                key={match.id}
                match={match}
                onSave={(a,b) => setResult.mutate({
                  idTournir: idTournir,
                  matchId: match.id,
                  scoreA: a,
                  scoreB: b
                })}
              />
            ))}

          </div>
        );
      })}

    </div>
  );
}

function MatchRow({
  match,
  onSave
}: {
  match: GroupMatch;
  onSave: (a: number, b: number) => void;
}) {

  const [scoreA, setScoreA] = useState("0");
  const [scoreB, setScoreB] = useState("0");
  const [saved, setSaved] = useState(false);

  const playerAName = match.playerA.participant
    ? `${match.playerA.participant.surname || ""} ${match.playerA.participant.firstname || ""}`
    : "Без имени";

  const playerBName = match.playerB.participant
    ? `${match.playerB.participant.surname || ""} ${match.playerB.participant.firstname || ""}`
    : "Без имени";

  if (match.status === "FINISHED" || saved)
    return (
      <div className="flex gap-3 items-center bg-gray-800 p-3 rounded-xl opacity-50">
        <span>{playerAName}</span>
        <span>{scoreA}</span>
        :
        <span>{scoreB}</span>
        <span>{playerBName}</span>
        <span className="ml-auto">Результат введён</span>
      </div>
    );

  return (
    <div className="flex gap-3 items-center bg-gray-800 p-3 rounded-xl">

      <span>{playerAName}</span>

      <input
        type="number"
        value={scoreA}
        onChange={(e) => setScoreA(e.target.value)}
        className="w-16 text-black rounded px-2"
      />

      :

      <input
        type="number"
        value={scoreB}
        onChange={(e) => setScoreB(e.target.value)}
        className="w-16 text-black rounded px-2"
      />

      <span>{playerBName}</span>

      <button
        onClick={() => {
          onSave(scoreA !== "" && Number(scoreA)>0 ? Number(scoreA) : 0, scoreB !== "" && Number(scoreB)>0 ? Number(scoreB) : 0);
          setSaved(true); 
        }}
        className="ml-auto px-3 py-1 bg-blue-500 rounded"
      >
        Сохранить
      </button>

    </div>
  );
}
