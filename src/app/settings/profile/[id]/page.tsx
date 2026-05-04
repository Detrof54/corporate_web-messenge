"use server";

import { api } from "~/trpc/server";
import { UserProfile } from "~/app/_components/profile/UserProfile";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = params;


  const user = await api.profile.getInfoUserById({ id });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">
        <p>Пользователь не найден</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <UserProfile user = {user} />
    </div>
  );
}