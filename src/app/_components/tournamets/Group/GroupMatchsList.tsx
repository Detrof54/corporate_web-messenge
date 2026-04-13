import type { Group, GroupMatch } from "./Group";
import { MatchStatus } from "@prisma/client";

export default function GroupMatchList({ groups }: {groups: Group[]}){

    return (
        <div className="flex flex-col gap-12">
        {groups.map((group) => {
            const rounds = group.matches.reduce<Record<number, GroupMatch[]>>(
                (acc, match) => {
                    const round = match.round;

                    if (!acc[round]) {
                    acc[round] = [];
                    }

                    acc[round].push(match);
                    return acc;
                },
                {}
            );

            return (
            <div
                key={group.id}
                className="rounded-xl border border-gray-700 bg-gray-900 p-6 text-white"
            >
                <h2 className="mb-6 text-xl font-semibold">
                Группа {group.name}
                </h2>
                {group.matches.length === 0 && <p className="text-center text-gray-400"> Матчи еще не сформированы </p>}

                {Object.entries(rounds)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([round, matches]) => {
                    const sortedMatches = [...matches].sort((a, b) => {
                    if (a.result && !b.result) return -1;
                    if (!a.result && b.result) return 1;

                    const dateA =
                        a.result?.createdAt?.getTime() ?? 0;
                    const dateB =
                        b.result?.createdAt?.getTime() ?? 0;

                    return dateA - dateB;
                    });

                    return (
                    <div key={round} className="mb-8">
                        <h3 className="mb-4 text-lg font-medium">
                            {round === "0" ?"Дополнительные матчи": `Тур ${round}`}
                        </h3>

                        <ul className="space-y-2">
                        {sortedMatches.map((match) => {
                            const a = match.playerA.participant;
                            const b = match.playerB.participant;

                            return (
                            <li
                                key={match.id}
                                className={`flex items-center justify-between rounded-md px-4 py-2 ${
                                match.result
                                    ? "bg-gray-800"
                                    : "bg-gray-800/50 text-gray-400"
                                }`}
                            >
                                <span>
                                    {a ? `${a.surname}  ${a.firstname}` : "Без имени"}
                                </span>

                                <span className="mx-3 font-semibold">
                                {match.result
                                    ? `${match.result.scoreA}:${match.result.scoreB}`
                                    : "- : -"}
                                </span>

                                <span>
                                    {b ? `${b.surname}  ${b.firstname}` : "Без имени"}
                                </span>
                            </li>
                            );
                        })}
                        </ul>
                    </div>
                    );
                })}
            </div>
            );
        })}
        </div>
    );
}