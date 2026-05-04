"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Delete, ShoppingCart, Trash2, UserMinus, UserX } from "lucide-react";

interface Props {
  userId: string;
}

export function DeleteProfileButton({ userId }: Props) {
  const router = useRouter();

  const deleteProfile =
    api.profile.deleteProfile.useMutation({
      onSuccess: () => {
        router.refresh(); 
      },
    });

  return (
    <div>
      <button
        className="flex flex-col items-center justify-center
          w-30 h-16
          rounded-2xl
          transition-all duration-200
          text-red-500 hover:text-white hover:bg-gray-800"
        onClick={() => {

          deleteProfile.mutate({
            id_user: userId,
          });
        }}
      >
        <div className="text-xl"><Trash2 size={25} color="red"/></div>
        <span className="text-xs font-medium">Удалить профиль</span>
      </button>
    </div>
  );
}
