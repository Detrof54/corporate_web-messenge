"use server";

import { ChatsList } from "~/app/_components/chat/ChatsList";
import { Chat } from "~/app/_components/chat/Chat";
import { auth } from "~/server/auth";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }:PageProps) {
  const session = await auth();

  return (
    <div className="flex h-screen w-full">
      <ChatsList userId={session?.user.id} folder_id={params.id} />
      <Chat userId={session?.user.id} />
    </div>
  );
}