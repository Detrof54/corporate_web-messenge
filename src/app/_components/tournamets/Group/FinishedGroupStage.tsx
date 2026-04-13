"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import type { Group } from "./Group";
import { TypeStage } from "@prisma/client";

export default function FinishedGroupStage({
  idTournir,
  groups,
  stage,
  onFinished
}: {
  idTournir: string;
  groups: Group[];
  stage: TypeStage;
  onFinished: () => void;
}) {

  const utils = api.useUtils();

  const finishMutation = api.tournametsRouter.finishGroupStage.useMutation({
    onSuccess: () => {
      utils.tournametsRouter.getTurnir.invalidate();
      onFinished();
    }
  });

  const allMatches = groups.flatMap(g => g.matches);
  const allFinished =
    stage === TypeStage.GROUP &&
    allMatches.length > 0 &&
    allMatches.every(m => m.result !== null);

  return (
    <button
      disabled={!allFinished}
      onClick={() => finishMutation.mutate({ idTournir })}
      className={`px-6 py-3 rounded-xl font-semibold transition
        ${allFinished
          ? "bg-emerald-500 hover:bg-emerald-600"
          : "bg-gray-500 opacity-60 cursor-not-allowed"
        }`}
    >
      Завершить групповой этап
    </button>
  );
}