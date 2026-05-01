"use server";

import { api } from "~/trpc/server";
import { auth } from "~/server/auth";
import { UserProfile } from "~/app/_components/profile/UserProfile";
import { ChatsList } from "~/app/_components/chats/ChatsList";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const session = await auth();

  return(
    <div className="h-full ">
      <ChatsList userId = {session?.user.id} folder_id = {params.id} />
    </div>
  )
}