"use client";

import { api } from "~/trpc/react";
import { DateFromFormate } from "~/lib/clear-format";
import { useState } from "react";
import { AddUserModal } from "./AddUserModal";
import { DeleteUserButton } from "./DeleteUserButton";
import { Pencil } from "lucide-react";
import { UpdateUserModal } from "./UpdateUserModal";
import { RoleSystem } from "@prisma/client";

export function UsersTable() {
    const [openAddUser, setOpenAddUser] = useState(false);
    const [editUser, setEditUser] = useState<any | null>(null);
    const { data: users, isLoading } = api.administration.getUsers.useQuery();

    const sortedUsers = [...(users ?? [])].sort((a, b) => {
        const nameA = `${a.firstname ?? ""} ${a.surname ?? ""}`.toLowerCase();
        const nameB = `${b.firstname ?? ""} ${b.surname ?? ""}`.toLowerCase();
        return nameA.localeCompare(nameB);
    });

    if (isLoading) {
        return (
        <div className="text-white">
            Загрузка пользователей...
        </div>
        );
    }

    return (
        <div>
            <button
                onClick={() =>
                    setOpenAddUser(true)
                }
                className="px-5 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 transition text-white whitespace-nowrap mb-2"
            >
                Добавить пользователя
            </button>
            <div className="w-full overflow-x-auto rounded-3xl bg-gray-900 border border-gray-800 ">

            
                <table className="w-full min-w-[1100px] text-sm text-left">
                    <thead className="bg-gray-800 text-gray-300 uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-6 py-4">№</th>
                            <th className="px-6 py-4">Имя</th>
                            <th className="px-6 py-4">Фамилия</th>
                            <th className="px-6 py-4">Отчество</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Роль</th>
                            <th className="px-6 py-4">Дата регистрации</th>
                            <th className="px-6 py-4"></th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>

                    <tbody>
                        {sortedUsers.map((user, index) => (
                            <tr
                                key={user.id}
                                className="border-t border-gray-800 hover:bg-gray-800/60 transition"
                            >
                                <td className="px-6 py-4 text-gray-400 font-mono text-xs max-w-[220px] truncate">
                                    {index + 1}
                                </td>
                                <td className="px-6 py-4 text-white">
                                    {user.firstname || "-"}
                                </td>
                                <td className="px-6 py-4 text-white">
                                    {user.surname || "-"}
                                </td>
                                <td className="px-6 py-4 text-white">
                                    {user.patronymic || "-"}
                                </td>
                                <td className="px-6 py-4 text-gray-300">
                                    {user.email || "-"}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full text-xs bg-violet-500/20 text-violet-300 whitespace-nowrap">
                                        {user.role === RoleSystem.ADMIN ? "Админ" : "Пользователь"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-300 whitespace-nowrap">
                                    {DateFromFormate(user.createdAt)}
                                </td>
                                <td className="px-6 py-4">
                                    <DeleteUserButton
                                        userId={user.id}
                                    />
                                    
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => setEditUser(user)}
                                        className="
                                            w-10 h-10
                                            flex items-center justify-center
                                            rounded-xl
                                            bg-blue-500/10
                                            text-blue-400
                                            hover:bg-blue-500/20
                                            hover:text-blue-300
                                            transition
                                        "
                                    >
                                        <Pencil size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <AddUserModal
                open={openAddUser}
                onClose={() =>
                    setOpenAddUser(false)
                }
            />
            <UpdateUserModal
                open={!!editUser}
                user={editUser}
                onClose={() => setEditUser(null)}
            />
        </div>
    );
}