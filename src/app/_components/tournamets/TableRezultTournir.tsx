"use client"

import { MatchStatus, Role, TiebreakType, TypeStage } from "@prisma/client";
import type { Group, TurnirParticipant } from "./Group/Group";
import type { Bracket, BracketMatch } from "./Bracket/Bracket";

export interface User{
  id: string
  firstname: string | null
  surname: string | null
  email: string | null
  role: Role
}

export interface Tournir {
  id: string;
  nameTurnir: string;
  description: string | null;
  stage: TypeStage
  participantsCount: number
  groupsCount: number
  tiebreakType: TiebreakType
  createdAt: Date
  updatedAt: Date
  createdById: string
  createdBy: User
  participants: TurnirParticipant[]
  groups: Group[]
  brackets: Bracket[]
}

type ResultRow = {
  place: number;
  participant: TurnirParticipant;
};


type PlaceMap = Map<string, number>;

export default function TableRezultTournir({
  tournir,
}: {
  tournir: Tournir;
}) {
  if (tournir.stage !== TypeStage.FINISHED) {
    return <h3 className="text-center text-gray-400">Турнир ещё не завершён</h3>;
  }

  const places: PlaceMap = new Map();
  let currentPlace = 1;


  function processBracket(bracketId: string) {
    const bracket = tournir.brackets.find(b => b.id === bracketId);
    if (!bracket || bracket.matches.length === 0) return;

    const finished = bracket.matches.filter(
      m => m.status === MatchStatus.FINISHED
    );

    if (finished.length === 0) return;
    const maxRound = Math.max(...finished.map(m => m.round));
    const final = finished.find(m => m.round === maxRound);

    if (final && final.result.length > 0) {
    const last = final.result.at(-1)!;

    if (last.winnerId) {
      if (!places.has(last.winnerId)) {
        places.set(last.winnerId, currentPlace++);
      }

      const loser =
        final.playerAId === last.winnerId
          ? final.playerBId
          : final.playerAId;

      if (!places.has(loser)) {
        places.set(loser, currentPlace++);
      }
    }
  }

  const thirdPlaceMatch = finished.find(m => m.round === 0);

  if (thirdPlaceMatch && thirdPlaceMatch.result.length > 0) {
    const r = thirdPlaceMatch.result.at(-1)!;

    if (r.winnerId) {
      if (!places.has(r.winnerId)) {
        places.set(r.winnerId, currentPlace++);
      }

      const loser =
        thirdPlaceMatch.playerAId === r.winnerId
          ? thirdPlaceMatch.playerBId
          : thirdPlaceMatch.playerAId;

      if (!places.has(loser)) {
        places.set(loser, currentPlace++);
      }
    }
  }

    const unresolved = tournir.participants.filter(
      p =>
        !places.has(p.id) &&
        bracket.matches.some(
          m => m.playerAId === p.id || m.playerBId === p.id
        )
    );

    unresolved
      .sort(
        (a, b) =>
          b.points - a.points ||
          (b.scoreFor - b.scoreAgainst) -
            (a.scoreFor - a.scoreAgainst)
      )
      .forEach(p => {
        if (!places.has(p.id)) {
          places.set(p.id, currentPlace++);
        }
      });
  }


  tournir.brackets.forEach(b => processBracket(b.id));


  const result = Array.from(places.entries())
    .map(([id, place]) => ({
      place,
      participant: tournir.participants.find(p => p.id === id)!,
    }))
    .sort((a, b) => a.place - b.place);


  return (
    <div className="mt-8">
      <h2 className="mb-4 text-2xl font-bold text-white">
        Итоговая таблица результатов
      </h2>

      <div className="overflow-hidden rounded-lg border border-gray-700">
        <table className="w-full text-sm text-white">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-4 py-2 text-left">Место</th>
              <th className="px-4 py-2 text-left">Участник</th>
              <th className="px-4 py-2 text-right">Очки</th>
              <th className="px-4 py-2 text-right">Победы</th>
              <th className="px-4 py-2 text-right">Разница</th>
            </tr>
          </thead>

          <tbody>
            {result.map(r => (
              <tr
                key={r.participant.id}
                className="border-t border-gray-700 hover:bg-gray-800"
              >
                <td className="px-4 py-2 font-semibold">
                  {r.place}
                </td>

                <td className="px-4 py-2">
                  {r.participant.participant?.surname}{" "}
                  {r.participant.participant?.firstname}
                </td>

                <td className="px-4 py-2 text-right">
                  {r.participant.points}
                </td>

                <td className="px-4 py-2 text-right">
                  {r.participant.wins}
                </td>

                <td className="px-4 py-2 text-right">
                  {r.participant.scoreFor -
                    r.participant.scoreAgainst}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
