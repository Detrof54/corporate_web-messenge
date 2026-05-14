import { api, HydrateClient } from "~/trpc/server";
import { auth } from "~/server/auth";
import { ChatsList } from "./_components/chat/ChatsList";

//ГЛАВНАЯ СТРАНИЦА
//Все чаты отображает

export default async function Home() {
  const session = await auth();

  return (
      <div className="h-full">
        <ChatsList userId = {session?.user.id}/>
      </div>
    )
  }
