import { auth } from "~/server/auth";
import { ChatsList } from "./_components/chat/ChatsList";

//ГЛАВНАЯ СТРАНИЦА
//Отображает список чатов

export default async function Home() {
  const session = await auth();

  return (
    <div className="h-full">
      <ChatsList userId = {session?.user.id}/>
    </div>
  )
}
