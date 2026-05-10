"use server"

import { auth } from "~/server/auth";
import { ProfileGC } from "~/app/_components/profileGroupOrChannel/ProfileeGC";

interface PageProps {
  params: {
    id: string;
  };
}

//Страница для отображения профиля группы/канала (функционал отображения профиля, обновления, удаления)
export default async function Page({params,}:PageProps) {
  const { id } = params;
  const session = await auth();

  return (
    <div className="h-screen w-full bg-gray-950 overflow-y-auto">
      <ProfileGC
        chatId={id}
        currentUserId={session?.user.id}
      />
    </div>
  );
}