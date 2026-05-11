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
    <div className="">
      <h1 className=" text-2xl font-bold text-white mt-4 text-center break-words min-h-[36px] w-full">
        Админнистрирование
      </h1>
      <ProfileGC
        chatId={id}
        currentUserId={session?.user.id}
      />
    </div>
  );
}