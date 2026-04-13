"use server";

import Tournir from "~/app/_components/tournamets/Tournir";
import { auth } from "~/server/auth";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
    const session = await auth();
    const {id} = await params

    return (
        <div className="min-h-screen bg-gray-900 p-4 text-white">
            <Tournir role={session?.user.role} idTournir = {id} idUser = {session?.user.id}/>
        </div>
    );
}