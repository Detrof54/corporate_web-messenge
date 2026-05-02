"use server";

import { api } from "~/trpc/server";
import { auth } from "~/server/auth";
import { UserProfile } from "~/app/_components/profile/UserProfile";
import { ChatsList } from "~/app/_components/chat/ChatsList";

interface PageProps {
  params: {
    id: string;
  };
}

//СТРАНИЦА FOLDER
//Отображение списка чатов выбранной папки

export default async function Page({ params }: PageProps) {
  const session = await auth();

  return(
    <div className="h-full ">
      <ChatsList userId = {session?.user.id} folder_id = {params.id} />
    </div>
  )
}