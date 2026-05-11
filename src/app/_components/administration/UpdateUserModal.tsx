"use client";

import { useEffect, useState } from "react";
import { api } from "~/trpc/react";

interface Props {
    open: boolean;
    onClose: () => void;

    user: {
        id: string;
        firstname: string | null;
        surname: string | null;
        patronymic: string | null;
        email: string | null;
        role: "ADMIN" | "USER";
    };
}

export function UpdateUserModal({
    open,
    onClose,
    user,
}: Props) {

    const [firstname, setFirstname] = useState("");
    const [surname, setSurname] = useState("");
    const [patronymic, setPatronymic] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<"ADMIN" | "USER">("USER");

    const utils = api.useUtils();

    const updateUser =
        api.administration.updateUser.useMutation({
            onSuccess: async () => {
                await utils.administration.getUsers.invalidate();
                onClose();
            },
        });

    useEffect(() => {
        if (user) {
            setFirstname(user.firstname ?? "");
            setSurname(user.surname ?? "");
            setPatronymic(user.patronymic ?? "");
            setEmail(user.email ?? "");
            setRole(user.role);
        }
    }, [user]);

    const styleInput = "w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white outline-none focus:border-violet-500 transition"

    if (!open) return null;

    return (
        <div
            className="
                fixed inset-0
                z-50
                flex items-center justify-center
                bg-black/70
                backdrop-blur-sm
                p-4
            "
        >

            <div
                className="
                    w-full
                    max-w-xl
                    rounded-3xl
                    bg-gray-900
                    border border-gray-800
                    p-6
                    flex flex-col gap-5
                "
            >

                {/* HEADER */}
                <div>

                    <h2 className="text-3xl font-bold text-white">
                        Редактирование пользователя
                    </h2>

                    <p className="text-gray-400 mt-2">
                        Обновление данных пользователя системы
                    </p>

                </div>
                
                <div>
                    <div className="text-sm text-gray-400 mb-2">
                            Имя
                    </div>
                    <input
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        placeholder="Имя"
                        className={styleInput}
                    />
                </div>

                <div>
                    <div className="text-sm text-gray-400 mb-2">
                        Фамилия
                    </div>
                    <input
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        placeholder="Фамилия"
                        className={styleInput}
                    />
                </div>

                <div>
                    <div className="text-sm text-gray-400 mb-2">
                        Отчество
                    </div>
                    <input
                        value={patronymic}
                        onChange={(e) => setPatronymic(e.target.value)}
                        placeholder="Отчество"
                        className={styleInput}
                    />
                </div>

                <div>
                    <div className="text-sm text-gray-400 mb-2">
                        Email
                    </div>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className={styleInput}
                    />
                </div>

                <div>
                    <div className="text-sm text-gray-400 mb-2">
                            Роль
                    </div>
                    <select
                        value={role}
                        onChange={(e) =>
                            setRole(e.target.value as "ADMIN" | "USER")
                        }
                        className="
                                w-full
                                bg-gray-800
                                border border-gray-700
                                rounded-2xl
                                px-4 py-3
                                text-white
                                outline-none
                                focus:border-violet-500
                                transition
                            "
                    >
                        <option value="USER">Пользователь</option>
                        <option value="ADMIN">Администратор</option>
                    </select>
                </div>
                <div className="flex gap-3">

                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-gray-800 text-white rounded-2xl"
                    >
                        Отмена
                    </button>

                    <button
                        onClick={() =>
                            updateUser.mutate({
                                userId: user.id,
                                firstname,
                                surname,
                                patronymic,
                                email,
                                role,
                            })
                        }
                        className="flex-1 py-3 bg-blue-600 text-white rounded-2xl"
                    >
                        Сохранить
                    </button>

                </div>

            </div>
        </div>
    );
}