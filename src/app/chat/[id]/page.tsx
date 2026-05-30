"use server";

import { ChatsList } from "~/app/_components/chat/ChatsList";
import { Chat } from "~/app/_components/chat/Chat";
import { auth } from "~/server/auth";

//СТРАНИЦА ЧАТА
//(Отображает список чатов + выбранный чат)

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const session = await auth();

  return (
    <div className="flex h-screen w-full">
      <ChatsList userId={session?.user.id} />
      <Chat userId={session?.user.id!} />
    </div>
  );
}