import { api, HydrateClient } from "~/trpc/server";
import { auth } from "~/server/auth";

//Все чаты отображает

export default async function Home() {
  const session = await auth();

  return (
      <div className="min-h-screen w-full !bg-gray-800 p-4 text-white">
        <h1>Главная страница</h1>
      </div>
    )
  }
