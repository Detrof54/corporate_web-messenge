"use server";

import { api } from "~/trpc/server";
import { NavItem, NavItemSettings } from "../ui/NavItem";
import { Folder, Link, LogOut, Settings, User } from "lucide-react";
import { auth } from "~/server/auth";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page() {
  const session = await auth()
  const userId = session?.user.id

  return (
    <div className="w-full max-w-lg mx-auto bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-2xl text-center space-y-6">
      <div className="flex flex-col items-center" >
        <h2 className="text-2xl font-bold mt-4 text-white">Настройки</h2>
        <NavItemSettings
          href={`/settings/profile/${userId}`}
          active={false}
          icon={<User size={20} />}
          label="Профиль"
        />
        <NavItemSettings
          href={`/settings/settingFolders/${userId}`}
          active={false}
          icon={<Folder size={20} />}
          label="Настройка папок"
        />
        <NavItemSettings
        href={`/api/auth/signout`}
        active={true}
        icon={<LogOut size={20} />}
        label="Выйти из аккаунта"
      />

      </div>
    </div>

  );
}