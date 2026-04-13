"use client";

import { api } from "~/trpc/react";
import { BracketType, MatchStatus, type Turnir } from "@prisma/client";

export interface Participant{
  id: string;
  firstname: string;
  surname: string;
  rating: number;
}
export interface TurnirParticipant{
  id: string;
  points: number;
  wins: number;
  defeat: number;
  scoreFor: number;
  scoreAgainst: number;
  participantId: string | null;
  participant: Participant | null;
  tournamentId: string;
  groupId: string | null;
}
export interface BracketpMatchResult {
  id: string;
  scoreA: number;
  scoreB: number;
  winnerId: string | null;
  bracketMatchId: string | null;
  createdAt: Date;
}
export interface BracketMatch {
  id: string;
  round: number;
  status: MatchStatus;
  playerAId: string;
  playerA: TurnirParticipant;
  playerBId: string;
  playerB: TurnirParticipant;
  result: BracketpMatchResult[];
  bracketId: string;
}
export interface Bracket {
  id: string;
  type: BracketType;
  doubleElim: boolean;
  tournamentId:string;
  matches: BracketMatch[];
}

const BRACKET_TITLES: Record<BracketType, string> = {
  UPPER: "Верхняя сетка",
  LOWER: "Нижняя сетка",
  CONSOLATION: "Утешительная сетка",
};

export default function Bracket({ brackets }: { brackets: Bracket[] }) {
  if (brackets.length === 0) return <h3 className="text-center text-gray-400">Сетки еще не сформированы</h3>;

  return (
    <div className="space-y-12">
      {brackets.map((bracket) => {
        if (bracket.matches.length === 0) return null;

        const extraMatches = bracket.matches.filter((m) => m.round === 0);
        const bracketMatches = bracket.matches.filter((m) => m.round > 0);

        const rounds = Object.entries(
          bracketMatches.reduce<Record<number, BracketMatch[]>>((acc, m) => {
            (acc[m.round] ??= []).push(m);
            return acc;
          }, {})
        )
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([, matches]) => matches);

        return (
          <section key={bracket.id} className="space-y-8">
            {/* СЕТКА */}
            {rounds.length > 0 && (
              <>
                <h2 className="mb-4 text-xl font-bold text-white">
                  {BRACKET_TITLES[bracket.type]}
                </h2>

                <div className="flex gap-8 overflow-x-auto pb-4">
                  {rounds.map((matches, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-6 min-w-[220px]"
                    >
                      <div className="text-center text-sm text-gray-400">
                        Тур {matches[0]?.round}
                      </div>

                      {matches.map((match) => (
                        <MatchCard key={match.id} match={match} />
                      ))}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ДОП МАТЧИ */}
            {extraMatches.length > 0 && (
              <ExtraMatchesTable matches={extraMatches} />
            )}
          </section>
        );
      })}
    </div>
  );
}

function MatchCard({ match }: { match: BracketMatch }) {
  const nameA =
    match.playerA.participant?.surname ??
    "—";
  const nameB =
    match.playerB.participant?.surname ??
    "—";

  return (
    <div className="rounded-lg bg-gray-800 p-3 shadow border border-gray-700">
      <div className="flex justify-between text-sm text-white">
        <span>{nameA}</span>
        <span>{nameB}</span>
      </div>

      {match.status === MatchStatus.FINISHED && match.result.length > 0 && (
        <div className="mt-2 space-y-1 text-xs text-gray-300">
          {match.result.map((r, i) => (
            <div
              key={r.id}
              className="flex justify-center gap-2"
            >
              <span>
                {r.scoreA} : {r.scoreB}
              </span>
            </div>
          ))}
        </div>
      )}

      {match.status === MatchStatus.SCHEDULED && (
        <div className="mt-2 text-center text-xs text-gray-500">
          Матч запланирован
        </div>
      )}
    </div>
  );
}

function ExtraMatchesTable({ matches }: { matches: BracketMatch[] }) {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
      <h3 className="mb-4 text-lg font-semibold text-white">
        Дополнительные матчи (распределение мест)
      </h3>

      <table className="w-full text-sm text-gray-300">
        <thead>
          <tr className="border-b border-gray-700 text-gray-400">
            <th className="py-2 text-left">Участник 1</th>
            <th className="py-2 text-left">Участник 2</th>
            <th className="py-2 text-center">Результаты</th>
            <th className="py-2 text-center">Статус</th>
          </tr>
        </thead>

        <tbody>
          {matches.map((match) => {
            const nameA =
              match.playerA.participant?.surname ?? "—";
            const nameB =
              match.playerB.participant?.surname ?? "—";

            return (
              <tr
                key={match.id}
                className="border-b border-gray-800 last:border-0"
              >
                <td className="py-2">{nameA}</td>
                <td className="py-2">{nameB}</td>

                <td className="py-2 text-center">
                  {match.status === MatchStatus.FINISHED &&
                  match.result.length > 0 ? (
                    <div className="flex justify-center gap-2">
                      {match.result.map((r) => (
                        <span key={r.id}>
                          {r.scoreA}:{r.scoreB}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>

                <td className="py-2 text-center">
                  {match.status === MatchStatus.SCHEDULED && (
                    <span className="text-yellow-400">Запланирован</span>
                  )}
                  {match.status === MatchStatus.FINISHED && (
                    <span className="text-green-400">Сыгран</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
