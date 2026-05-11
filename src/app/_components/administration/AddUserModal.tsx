"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface Props {
    open: boolean;
    onClose: () => void;
}

export function AddUserModal({
    open,
    onClose,
}: Props) {

    const utils = api.useUtils();

    const [firstname, setFirstname] = useState("");
    const [surname, setSurname] = useState("");
    const [patronymic, setPatronymic] = useState("");
    const [email, setEmail] = useState("");

    const [role, setRole] = useState<
        "ADMIN" | "USER"
    >("USER");

    const createUser =
        api.administration.createUser.useMutation({
            onSuccess: async () => {

                await utils.administration.getUsers.invalidate();

                setFirstname("");
                setSurname("");
                setPatronymic("");
                setEmail("");
                setRole("USER");

                onClose();
            },
        });

    if (!open) {
        return null;
    }

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
                        Добавление пользователя
                    </h2>

                    <p className="text-gray-400 mt-2">
                        Создание нового пользователя системы
                    </p>

                </div>

                {/* FIRSTNAME */}
                <div>

                    <div className="text-sm text-gray-400 mb-2">
                        Имя
                    </div>

                    <input
                        value={firstname}
                        onChange={(e) =>
                            setFirstname(e.target.value)
                        }
                        placeholder="Введите имя"
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
                    />

                </div>

                {/* SURNAME */}
                <div>

                    <div className="text-sm text-gray-400 mb-2">
                        Фамилия
                    </div>

                    <input
                        value={surname}
                        onChange={(e) =>
                            setSurname(e.target.value)
                        }
                        placeholder="Введите фамилию"
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
                    />

                </div>

                {/* PATRONYMIC */}
                <div>

                    <div className="text-sm text-gray-400 mb-2">
                        Отчество
                    </div>

                    <input
                        value={patronymic}
                        onChange={(e) =>
                            setPatronymic(e.target.value)
                        }
                        placeholder="Введите отчество"
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
                    />

                </div>

                {/* EMAIL */}
                <div>

                    <div className="text-sm text-gray-400 mb-2">
                        Email
                    </div>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        placeholder="Введите email"
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
                    />

                </div>

                {/* ROLE */}
                <div>

                    <div className="text-sm text-gray-400 mb-2">
                        Роль
                    </div>

                    <select
                        value={role}
                        onChange={(e) =>
                            setRole(
                                e.target.value as
                                    "ADMIN" | "USER"
                            )
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
                        <option value="USER">
                            Пользователь
                        </option>

                        <option value="ADMIN">
                            Администратор
                        </option>
                    </select>

                </div>

                {/* ERROR */}
                {createUser.error && (
                    <div
                        className="
                            rounded-2xl
                            bg-red-500/10
                            border border-red-500/30
                            px-4 py-3
                            text-sm text-red-300
                        "
                    >
                        {createUser.error.message}
                    </div>
                )}

                {/* BUTTONS */}
                <div className="flex items-center gap-3 pt-2">

                    <button
                        onClick={onClose}
                        className="
                            flex-1
                            py-3
                            rounded-2xl
                            bg-gray-800
                            hover:bg-gray-700
                            transition
                            text-white
                        "
                    >
                        Отмена
                    </button>

                    <button
                        disabled={
                            !firstname.trim() ||
                            !surname.trim() ||
                            !email.trim() ||
                            createUser.isPending
                        }
                        onClick={() =>
                            createUser.mutate({
                                firstname,
                                surname,
                                patronymic:
                                    patronymic.trim()
                                        ? patronymic
                                        : undefined,
                                email,
                                role,
                            })
                        }
                        className="
                            flex-1
                            py-3
                            rounded-2xl
                            bg-violet-600
                            hover:bg-violet-500
                            transition
                            text-white
                            disabled:opacity-50
                        "
                    >
                        {createUser.isPending
                            ? "Создание..."
                            : "Добавить"}
                    </button>

                </div>

            </div>
        </div>
    );
}