"use client";

"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  pilotId?: string;
  judgeId?: string;
}

export function DeleteProfileButton({ userId, pilotId, judgeId }: Props) {
  const router = useRouter();

  const deleteProfile =
    api.userProfileRouter.deleteProfile.useMutation({
      onSuccess: () => {
        router.refresh(); 
      },
    });

  return (
    <button
      className="mt-6 text-red-500"
      onClick={() => {

        deleteProfile.mutate({
          id_user: userId,
        });
      }}
    >
      Удалить профиль
    </button>
  );
}
