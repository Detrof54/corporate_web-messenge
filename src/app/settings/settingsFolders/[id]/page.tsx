"use server";

import { api } from "~/trpc/server";
import { UserProfile } from "~/app/_components/profile/UserProfile";
import { FolderList } from "~/app/_components/settingsFolder/FoldersList";



interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = params;


  return (
    <div className="w-full mx-auto">
      <FolderList userId={id}/>
    </div>
  );
}