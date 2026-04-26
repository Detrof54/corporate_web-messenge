import { api, HydrateClient } from "~/trpc/server";
import { auth } from "~/server/auth";

//Все чаты отображает

export default async function Home() {
  const session = await auth();

  return (
      <div className="min-h-screen w-full !bg-gray-900 p-4 text-white">
        
      </div>
    )
  }
