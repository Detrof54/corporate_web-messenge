"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { BracketType, MatchStatus } from "@prisma/client";
import type { Bracket, BracketMatch } from "./Bracket";

function Perevod(type: BracketType) {
  if (type === "UPPER") return "Верхняя сетка";
  if (type === "LOWER") return "Нижняя сетка";
  if (type === "CONSOLATION") return "Утешительная сетка";
}

export default function CreateMatchRezultBracket({
  idTournir,
  brackets,
  onUpdated
}: {
  idTournir: string,
  brackets: Bracket[],
  onUpdated: () => void,
}) {

  const [openBracketIds, setOpenBracketIds] = useState<string[]>([]);

  const setResult = api.tournametsBracketRouter.setMatchResult.useMutation({
    onSuccess: () => onUpdated()
  });

  return (
    <div className="space-y-10 mt-8">

      {brackets.map(bracket => {
        const unfinished = bracket.matches
          ?.filter(m => m.status === MatchStatus.SCHEDULED)
          .sort((a, b) => a.round - b.round) ?? [];

        if (!unfinished.length) {
          return (
            <div key={bracket.id}>
              <h3 className="text-xl font-bold">
                {Perevod(bracket.type)}
              </h3>
              <p>Все матчи завершены</p>
            </div>
          );
        }

        const currentRound = Math.min(...unfinished.map(m => m.round));
        const matchesRound = unfinished.filter(m => m.round === currentRound);
        const isOpen = openBracketIds.includes(bracket.id);

        return (
          <div key={bracket.id} className="bg-gray-900 p-6 rounded-xl">

            <h3 className="text-xl font-bold mb-3">
              {Perevod(bracket.type)} — Раунд {currentRound}
            </h3>

            <button
              onClick={() => {
                setOpenBracketIds(prev =>
                  prev.includes(bracket.id)
                    ? prev.filter(id => id !== bracket.id)
                    : [...prev, bracket.id]
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
                loading={setResult.isPending}
                onSave={(a, b) =>
                  setResult.mutate({
                    idTournir: idTournir,
                    matchId: match.id,
                    scoreA: a,
                    scoreB: b
                  })
                }
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
  onSave,
  loading
}: {
  match: BracketMatch;
  onSave: (a: number, b: number) => void;
  loading: boolean;
}) {

  const [scoreA, setScoreA] = useState("");
  const [scoreB, setScoreB] = useState("");

  const results = match.result ?? [];

  const winsA = results.filter(r => r.winnerId === match.playerAId).length;
  const winsB = results.filter(r => r.winnerId === match.playerBId).length;

  const playerAName =
    match.playerA.participant
      ? `${match.playerA.participant.surname ?? ""} ${match.playerA.participant.firstname ?? ""}`
      : "Без имени";

  const playerBName =
    match.playerB.participant
      ? `${match.playerB.participant.surname ?? ""} ${match.playerB.participant.firstname ?? ""}`
      : "Без имени";

  if (match.status === MatchStatus.FINISHED) {
    return (
      <div className="flex gap-3 items-center bg-gray-800 p-3 rounded-xl opacity-50">
        <span>{playerAName}</span>
        <span className="font-bold">{winsA}</span>
        :
        <span className="font-bold">{winsB}</span>
        <span>{playerBName}</span>
        <span className="ml-auto text-green-400">Матч завершён</span>
      </div>
    );
  }

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

      <span className="ml-4 text-sm text-gray-400">
        Серия: {winsA} - {winsB}
      </span>

      <button
        disabled={loading}
        onClick={() => {
          const a = Number(scoreA);
          const b = Number(scoreB);
          if (isNaN(a) || isNaN(b)) return;

          onSave(a, b);
          setScoreA("");
          setScoreB("");
        }}
        className="ml-auto px-3 py-1 bg-blue-500 rounded disabled:opacity-50"
      >
        Сохранить
      </button>

    </div>
  );
}