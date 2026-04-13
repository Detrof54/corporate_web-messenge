"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { TypeStage } from "@prisma/client";

export default function FormationBracket({
  idTournir,
  stage,
  totalParticipants,
  onCreated
}: {
  idTournir: string;
  stage: TypeStage;
  totalParticipants: number;
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);

  const [upperSize, setUpperSize] = useState(2);
  const [upperDouble, setUpperDouble] = useState(false);

  const [lowerCreate, setLowerCreate] = useState(true);
  const [lowerSize, setLowerSize] = useState(0);
  const [lowerDouble, setLowerDouble] = useState(false);

  const [consolationCreate, setConsolationCreate] = useState(true);
  const [consolationSize, setConsolationSize] = useState(0);
  const [consolationDouble, setConsolationDouble] = useState(false);

  const mutation = api.tournametsBracketRouter.formationBracket.useMutation({
    onSuccess: () => {
      onCreated();
      setOpen(false);
    },
  });

  const evenFloor = (n: number) => (n % 2 === 0 ? n : n - 1);
  const evenRange = (min: number, max: number) => {
    const arr: number[] = [];
    for (let i = min; i <= max; i += 2) arr.push(i);
    return arr;
  };

  const maxUpper =
    totalParticipants <= 4
      ? evenFloor(totalParticipants)
      : evenFloor(Math.floor(totalParticipants * 0.8));
  const upperOptions = evenRange(2, maxUpper);

  const remainingAfterUpper = totalParticipants - upperSize;
  const lowerMax = lowerCreate ? evenFloor(Math.max(0, remainingAfterUpper)) : 0;
  const lowerOptions = lowerCreate && lowerMax >= 2 ? evenRange(2, lowerMax) : [];

  const remainingAfterLower = totalParticipants - upperSize - lowerSize;
  const consolationMax = consolationCreate ? evenFloor(Math.max(0, remainingAfterLower)) : 0;
  const consolationOptions =
    consolationCreate && consolationMax >= 2 ? evenRange(2, consolationMax) : [];

  useEffect(() => {
    if (!upperOptions.includes(upperSize)) setUpperSize(upperOptions[0] ?? 2);
  }, [upperOptions, upperSize]);

  useEffect(() => {
    if (!lowerOptions.includes(lowerSize)) setLowerSize(lowerOptions[0] ?? 0);
  }, [lowerOptions, lowerSize]);

  useEffect(() => {
    if (!consolationOptions.includes(consolationSize))
      setConsolationSize(consolationOptions[0] ?? 0);
  }, [consolationOptions, consolationSize]);

  const effectiveLowerSize =
    lowerCreate && lowerOptions.includes(lowerSize) ? lowerSize : 0;
  const effectiveConsolationSize =
    consolationCreate && consolationOptions.includes(consolationSize)
      ? consolationSize
      : 0;

  const totalUsed = upperSize + effectiveLowerSize + effectiveConsolationSize;
  const isValid = upperSize >= 2 && totalUsed <= totalParticipants;


  if (stage !== TypeStage.BRACKET) return null;


  return (
    <>
      <button
        className="px-6 py-3 bg-green-600 rounded-xl"
        onClick={() => setOpen(true)}
      >
        Сформировать сетки
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
          <div className="bg-gray-800 text-white p-8 rounded-2xl w-[450px] space-y-6">
            <h2 className="text-2xl font-bold text-center">Настройка сеток</h2>

            <div className="space-y-3 border-b border-gray-700 pb-4">
              <h3 className="font-semibold text-lg">Верхняя сетка</h3>
              <div className="flex justify-between">
                <span>Участников</span>
                <select
                  value={upperSize}
                  onChange={e => setUpperSize(Number(e.target.value))}
                  className="bg-gray-700 px-3 py-2 rounded"
                >
                  {upperOptions.map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={upperDouble}
                  onChange={e => setUpperDouble(e.target.checked)}
                />
                <span>Выбыванием после двух поражений</span>
              </div>
            </div>

            <div className="space-y-3 border-b border-gray-700 pb-4">
              <div className="flex justify-between">
                <h3 className="font-semibold text-lg">Нижняя сетка</h3>
                <input
                  type="checkbox"
                  checked={lowerCreate}
                  onChange={e => setLowerCreate(e.target.checked)}
                />
              </div>
              {lowerCreate && (
                lowerOptions.length === 0 ? (
                  <div className="text-red-400 text-sm">Нет участников</div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span>Участников</span>
                    <select
                      value={effectiveLowerSize}
                      onChange={e => setLowerSize(Number(e.target.value))}
                      className="bg-gray-700 px-3 py-2 rounded"
                    >
                      {lowerOptions.map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                    <div className="flex items-center space-x-2 ml-2">
                      <input
                        type="checkbox"
                        checked={lowerDouble}
                        onChange={e => setLowerDouble(e.target.checked)}
                      />
                      <span>Выбыванием после двух поражений</span>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <h3 className="font-semibold text-lg">Утешительная сетка</h3>
                <input
                  type="checkbox"
                  checked={consolationCreate}
                  onChange={e => setConsolationCreate(e.target.checked)}
                />
              </div>
              {consolationCreate && (
                consolationOptions.length === 0 ? (
                  <div className="text-red-400 text-sm">Нет участников</div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span>Участников</span>
                    <select
                      value={effectiveConsolationSize}
                      onChange={e => setConsolationSize(Number(e.target.value))}
                      className="bg-gray-700 px-3 py-2 rounded"
                    >
                      {consolationOptions.map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                    <div className="flex items-center space-x-2 ml-2">
                      <input
                        type="checkbox"
                        checked={consolationDouble}
                        onChange={e => setConsolationDouble(e.target.checked)}
                      />
                      <span>Выбыванием после двух поражений</span>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-700">
              <button
                className="px-5 py-2 bg-gray-600 rounded"
                onClick={() => setOpen(false)}
              >
                Отмена
              </button>

              <button
                disabled={!isValid}
                className={`px-5 py-2 rounded ${
                  isValid ? "bg-green-600" : "bg-gray-500 cursor-not-allowed"
                }`}
                onClick={() =>
                  mutation.mutate({
                    idTournir,
                    upper: { create: true, size: upperSize, doubleElim: upperDouble },
                    lower: {
                      create: lowerCreate && lowerOptions.length > 0,
                      size: effectiveLowerSize,
                      doubleElim: lowerDouble,
                    },
                    consolation: {
                      create: consolationCreate && consolationOptions.length > 0,
                      size: effectiveConsolationSize,
                      doubleElim: consolationDouble,
                    },
                  })
                }
              >
                Создать
              </button>
            </div>

            <div className="text-sm text-gray-400 text-center">
              Использовано: {totalUsed} из {totalParticipants}
            </div>
          </div>
        </div>
      )}
    </>
  );
}