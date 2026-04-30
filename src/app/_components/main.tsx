import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { SigninLink } from "./signlink";
import { Sidebar } from "./sidebar";

export async function MyApp({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <HydrateClient>
      {session ? (
        <div className="flex h-screen bg-gray-800 text-white">
          
          {/* Sidebar */}
          <Sidebar userId={session.user.id} />

          {/* Контент */}
          <main className="flex-1 overflow-auto p-4">
            {children}
          </main>

        </div>
      ) : (
        <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
          <SigninLink />
        </div>
      )}
    </HydrateClient>
  );
}