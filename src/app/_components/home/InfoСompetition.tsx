"use client";
import { Card, CardContent } from "~/app/ui/card";
import { useState } from "react";

export default function InfoCompetition() {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="w-full bg-white/5 border-white/10 text-white">
      <CardContent className="p-6 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-center">
          Соревнования по смешанной системе
        </h2>
        <p className="text-base text-white/90 leading-relaxed text-center">
          Соревнования проводятся в два этапа: групповой турнир и игры на
          выбывание.
        </p>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pt-2 flex flex-col gap-1 text-base  text-white/90 leading-relaxed">
            <p>
              На групповом этапе участники разбиваются на группы, внутри которых
              проводятся соревнования по круговой системе.
            </p>
            <p>
              Занявшие первые места попадают в верхнюю сетку, несколько следующих
              мест — во вторую, и т.д.
            </p>
            <p>
              На втором этапе внутри каждой сетки проводятся соревнования на
              выбывание, в том числе возможен формат с выбыванием после двух
              поражений.
            </p>
          </div>
        </div>
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="self-center text-sm text-white/60 hover:text-white transition-colors"
        >
          {expanded ? "Свернуть" : "Подробнее"}
        </button>
      </CardContent>
    </Card>
  );
}