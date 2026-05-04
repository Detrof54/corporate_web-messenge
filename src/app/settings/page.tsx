"use server";

import { api } from "~/trpc/server";
import { NavItem, NavItemFromSettings } from "../ui/NavItem";
import { Folder, Link, LogOut, Settings, User } from "lucide-react";
import { auth } from "~/server/auth";

export default async function Page() {
  const session = await auth()
  const userId = session?.user.id

  return (
    <div className="w-full max-w-lg mx-auto bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-2xl text-center space-y-6">
      <div className="flex flex-col items-center" >
        <h2 className="text-2xl font-bold mt-4 text-white">Настройки</h2>
        <NavItemFromSettings
          href={`/settings/profile/${userId}`}
          style="text-gray-300 hover:text-white hover:bg-gray-800"
          icon={<User size={20} />}
          label="Профиль"
        />
        <NavItemFromSettings
          href={`/settings/settingsFolders/${userId}`}
          style="text-gray-300 hover:text-white hover:bg-gray-800"
          icon={<Folder size={20} />}
          label="Настройка папок"
        />
        <NavItemFromSettings
        href={`/api/auth/signout`}
        style="text-red-500 hover:text-white hover:bg-gray-800"
        icon={<LogOut size={20} />}
        label="Выйти из аккаунта"
      />

      </div>
    </div>

  );
}