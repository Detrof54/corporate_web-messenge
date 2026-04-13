"use server";

import { auth } from "~/server/auth";
import TournirList from "../_components/tournamets/TournirList";

export default async function Page() {
    const session = await auth();

    return (
        <div className="min-h-screen bg-gray-900 p-4 text-white">
            <TournirList role = {session?.user.role} idUser = {session?.user.id}/>
        </div>
    );
}