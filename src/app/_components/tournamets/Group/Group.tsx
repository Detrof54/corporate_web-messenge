"use client";

import { api } from "~/trpc/react";
import { MatchStatus, type Turnir } from "@prisma/client";
import GroupTables from "./GroupTable";
import GroupMatchList from "./GroupMatchsList";

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
export interface GroupMatchResult {
  id: string;
  scoreA: number;
  scoreB: number;
  winnerId: string | null;
  groupMatchId: string | null;
  createdAt: Date;
}
export interface GroupMatch {
  id: string;
  round: number;
  status: MatchStatus;
  playerAId: string;
  playerA: TurnirParticipant;
  playerBId: string;
  playerB: TurnirParticipant;
  result: GroupMatchResult | null;
  groupId: string;
}
export interface Group {
  id: string;
  name: string;
  tournamentId: string;

  participants: TurnirParticipant[];
  matches: GroupMatch[];
}

export default function Group({ groups }: {groups: Group[]}){
    return (
      <div>
        {groups.length!==0 ? <GroupTables groups={groups}/>: <h3 className="text-1xl  mb-4 text-center text-gray-400">Групп нет</h3> }
        {groups.length!==0 ? <GroupMatchList groups={groups}/> : <h3 className="text-1xl  mb-4 text-center text-gray-400">Матчей нет</h3> }
      </div>
    )
}