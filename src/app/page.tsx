import { api, HydrateClient } from "~/trpc/server";
import TournamentOrganizersList from "./_components/home/OrganizersTournamentList";
import InfoCompetition from "./_components/home/InfoСompetition";
import PatricipantTournamentList from "./_components/home/ParticipantsTournamentList";
import { auth } from "~/server/auth";



export default async function Home() {
  const session = await auth();

  return (
      <div className="min-h-screen w-full !bg-gray-900 p-4 text-white">
        <InfoCompetition />
        <PatricipantTournamentList role = {session?.user.role}/>
      </div>
    )
  }
