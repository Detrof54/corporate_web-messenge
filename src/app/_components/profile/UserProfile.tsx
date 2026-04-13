"use client";
import type { $Enums, Role, TypeStage } from "@prisma/client";
import { EditBaseProfileModal } from "./EditBaseProfileModal";
import { DeleteProfileButton } from "./DeleteProfileButton";
import Link from "next/link";

interface Turnir {
  id: string;
  nameTurnir: string;
  description: string | null;
  stage: $Enums.TypeStage;
  participantsCount: number;
  groupsCount: number;
  tiebreakType: $Enums.TiebreakType;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
}

interface UserProfileProps {
  user: {
    id: string;
    firstname?: string | null;
    surname?: string | null;
    email?: string | null;
    image?: string | null;
    role: $Enums.Role;
    tournaments: Turnir[];
  };
}

export function PerevodStage(stage: TypeStage): string {
  if (stage === "GROUP") return "Групповой этап";
  if (stage === "BRACKET") return "Этап на выбывание";
  if (stage === "FINISHED") return "Турнир завершен";
  return "Этап не указан";
}

export function PerevodRole(role: Role): string {
  if (role === "USER") return "Пользователь";
  if (role === "ADMIN") return "Администратор";
  if (role === "ORGANIZER") return "Организатор";
  return "Нет роли";
}

export function UserProfile({ user }: UserProfileProps) {
  const fullName =
    user.firstname && user.surname
      ? `${user.firstname} ${user.surname}`
      : "Без имени";

  const isOrganizer = user.role === "ORGANIZER" || user.role === "ADMIN";

  return (
    <div className="w-full max-w-lg mx-auto bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-2xl text-center space-y-6">
      {/* Avatar */}
      <div className="flex flex-col items-center">
        <img
          src={user.image ?? "/default-avatar.jpg"}
          alt="user avatar"
          className="w-28 h-28 rounded-full object-cover border-4 border-gray-700 shadow-md"
        />
        <h2 className="text-2xl font-bold mt-4 text-white">{fullName}</h2>
        <p className="text-gray-400 text-sm">
          {user.email ?? "Email не указан"}
        </p>
        <span className="mt-2 px-4 py-1 text-xs rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500">
          {PerevodRole(user.role)}
        </span>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        <EditBaseProfileModal user={user} />
        <DeleteProfileButton userId={user.id} />
      </div>

      {/* Tournaments */}
      {isOrganizer && (
        <div className="text-left space-y-3">
          <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">
            Организованные турниры
          </h3>

          {user.tournaments.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Вы пока не создали ни одного турнира
            </p>
          ) : (
            <div className="space-y-2">
              {user.tournaments.map((tournir) => (
                <Link
                  key={tournir.id}
                  href={`/tournaments/${tournir.id}`}
                  className="block p-4 rounded-xl bg-gray-800 hover:bg-gray-700 transition-all duration-200 border border-gray-700 hover:border-indigo-500"
                >
                  <p className="font-medium text-gray-100">
                    {tournir.nameTurnir}
                  </p>
                  <p className="text-sm text-gray-400">
                    {PerevodStage(tournir.stage)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}