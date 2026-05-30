"use client";

import { UserMinus } from "lucide-react";
import { api } from "~/trpc/react";

interface Props {
    userId: string;
}

export function DeleteUserButton({ userId,}: Props){
    const utils = api.useUtils();
    const deleteUser = api.administration.deleteUser.useMutation({
        onSuccess: async () => {
            await utils.administration.getUsers.invalidate();
        },
    });

    return (
        <button
            onClick={() => {
                const confirmDelete = confirm("Удалить пользователя?");
                if (!confirmDelete) return
                deleteUser.mutate({ userId });
            }}
            disabled={deleteUser.isPending}
            className="
                w-10 h-10
                flex items-center justify-center
                rounded-xl
                bg-red-500/10
                text-red-400
                hover:bg-red-500/20
                hover:text-red-300
                transition
                disabled:opacity-50
            "
        >
            <UserMinus size={18} />
        </button>
    );
}