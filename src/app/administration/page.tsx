"use server";

import { auth } from "~/server/auth";
import { UsersTable } from "../_components/administration/UsersTable";

export default async function Page() {
  const session = await auth()
  const userId = session?.user.id

  return (
    <div className="min-h-screen w-full bg-gray-950 p-4 md:p-6 lg:p-8">
      <h1 className=" text-2xl font-bold text-violet-600 mt-1 text-center break-words min-h-[36px] w-full mb-6">
        Администрирование
      </h1>
      <div className="max-w-full mx-auto">
        <UsersTable />
      </div>
    </div>

  );
}