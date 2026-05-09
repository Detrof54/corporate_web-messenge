"use client";
import type { $Enums, RoleSystem } from "@prisma/client";
import { EditBaseProfileModal } from "./EditBaseProfileModal";
import { DeleteProfileButton } from "./DeleteProfileButton";
import Link from "next/link";
import { NavItem, NavItemBack } from "~/app/ui/NavItem";
import { ArrowLeft } from "lucide-react";

interface Props {
  user: UserProfileProps,
  userCurrentId?: string,
}

export interface UserProfileProps {
  id: string;
  image: string | null;
  firstname: string | null;
  surname: string | null;
  patronymic: string | null;
  email: string | null;
  createdAt: Date;
  role: $Enums.RoleSystem;
}

export function PerevodRole(role: RoleSystem): string {
  if (role === "USER") return "Пользователь";
  if (role === "ADMIN") return "Администратор";
  return "Нет роли";
}

function UserName (user: UserProfileProps){
  if(user.firstname && user.surname && user.patronymic)
    return ` ${user.surname} ${user.firstname} ${user.patronymic}`
  else if (user.firstname && user.surname && !user.patronymic)
    return ` ${user.surname} ${user.firstname}`
  return "Пользователь без ФИО"
}

function DateFromFormate (date: Date){
  const dateObject = new Date(date);

  if (isNaN(dateObject.getTime())) {
    return 'Неизвестная дата';
  } 
  else {
    const dateCreateUser = date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    return dateCreateUser
  }
}

export function UserProfile({user, userCurrentId} : Props) {
  const fullName = UserName(user);
  const isOwner = user.id === userCurrentId

  return (
    <div className="w-full max-w-lg mx-auto bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-2xl  space-y-6">


      {/* Редактирование профиля */}

      <div className="">
        <div className="flex justify-start">
          <NavItemBack
              href={isOwner ? `/settings/` :  `/`}
              icon={<ArrowLeft size={30} />}
          />
        </div>

        <div className="flex justify-end">
          {isOwner && <EditBaseProfileModal user={user} />}
        </div>
      </div>
      {/* Avatar */}
      <div className="flex flex-col items-center">
        <img
          src={user.image ?? "/default-avatar.jpg"}
          alt="user avatar"
          className="w-28 h-28 rounded-full object-cover border-4 border-gray-700 shadow-md"
        />
        
        <div className="flex flex-col items-center text-center">
          {/* ФИО */}
          <h2 className="text-2xl font-bold mt-3 text-gray-200">{fullName}</h2>
          <span className="text-xs text-gray-500">Фамилия Имя Отчество</span>
          {/* Роль */}
          <span className="mt-3 px-4 py-1 text-xs rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500">
            {PerevodRole(user.role)}
          </span>
          {/* Почта */}
          <div className="mt-4">
            <p className="text-gray-400 text-sm">
              {user.email ?? "Email не указан"}
            </p>
            <span className="text-xs text-gray-500 block">Почта пользователя</span>
          </div>
          {/* Дата */}
          <div className="mt-3">
            <p className="text-gray-400 text-sm">
              {DateFromFormate(user.createdAt)}
            </p>
            <span className="text-xs text-gray-500 block">Дата создания профиля</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        {isOwner && <DeleteProfileButton userId={user.id} />}
      </div>

    </div>
  );
}