"use client";

import { api } from "~/trpc/react";
import { MatchStatus } from "@prisma/client";
import type { Bracket } from "./Bracket";

interface Props {
  brackets: Bracket[];
  tournamentId: string;
  onUpdated: () => void;
}

export default function FinishedBracketStage({
  brackets,
  tournamentId,
  onUpdated,
}: Props) {

  const finishMutation =
    api.tournametsBracketRouter.finishTournament.useMutation({
      onSuccess: () => {
        alert("Турнир завершён");
        onUpdated();
      },
      onError: (err) => {
        alert(err.message);
      }
    });

  const allMatches = brackets.flatMap(b => b.matches ?? []);

  if (allMatches.length === 0) return null;

  const allFinished = allMatches.every(
    (m) => m.status === MatchStatus.FINISHED
  );

  if (!allFinished) return null;

  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={() =>
          finishMutation.mutate({ tournamentId })
        }
        disabled={finishMutation.isPending}
        className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-semibold shadow-lg disabled:opacity-50"
      >
        {finishMutation.isPending
          ? "Завершение..."
          : "Завершить турнир"}
      </button>
    </div>
  );
}