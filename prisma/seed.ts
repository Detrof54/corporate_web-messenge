import { PrismaClient, Role } from "@prisma/client";
import path from "path";
import fs from "fs";
import { admins, bracketMatches, bracketMatchResults, brackets, groupMatches, groupMatchResults, groups, organizer, participants, turnirParticipants, turnirs, users } from "./data";

const prisma = new PrismaClient();

interface Arr{
  id: string,
  firstname: string,
  surname: string,
  email: string,
  role: Role,
}
//Типовые функции
async function User(arrUser: Arr[]){
  for (const user of arrUser) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        firstname: user.firstname,
        surname: user.surname,
        email: user.email,
        role: user.role,
        emailVerified: new Date(),
      },
    });
  }

}

//удаление всех данных из БД
async function clearDb() {
  console.log("Удаляем старые данные...");

  await prisma.bracketMatchResult.deleteMany()
  await prisma.bracketMatch.deleteMany()
  await prisma.bracket.deleteMany()

  await prisma.groupMatchResult.deleteMany()
  await prisma.groupMatch.deleteMany()
  await prisma.group.deleteMany()

  await prisma.turnirParticipant.deleteMany()
  await prisma.turnir.deleteMany()
  await prisma.participant.deleteMany()
  await prisma.user.deleteMany()

  console.log("База очищена");
}

async function main() {
  // Удаляем данные
  await clearDb()

  console.log("🌱 Сидирование фиксированных данных...");

// =====  USER =====
  // Добавление пользователей, админов, организаторов
  await User(users)
  await User(admins)
  await User(organizer)
  // await User(referee)


// ===== PARTICIPANT =====
  // Создание сезонов
  for (const participant of participants) {
    await prisma.participant.upsert({
      where: { id: participant.id },
      update: {},
      create: { 
        id: participant.id, 
        firstname: participant.firstname, 
        surname: participant.surname,
        rating: participant.rating
      },
    })
  }

// =========== TURNIR ====================
  for (const turnir of turnirs) {
    await prisma.turnir.upsert({
      where: { id: turnir.id },
      update: {},
      create: {
        id: turnir.id,
        nameTurnir: turnir.nameTurnir,
        description: turnir.description,
        stage: turnir.stage,
        participantsCount: turnir.participantsCount,
        groupsCount: turnir.groupsCount,
        tiebreakType: turnir.tiebreakType,
        createdById: turnir.createdById
      },
    });
  }


// ============== GROUP =================
  for (const group of groups) {
    await prisma.group.upsert({
      where: { id: group.id },
      update: {},
      create: {
        id: group.id,
        name: group.name,
        tournamentId: group.tournamentId
      },
    });
  }

// ============== TurnirParticipant =================
  for (const tp of turnirParticipants) {
    await prisma.turnirParticipant.upsert({
      where: { id: tp.id },
      update: {},
      create: {
        id: tp.id,
        participantId: tp.participantId,
        tournamentId: tp.tournamentId,
        groupId: tp.groupId,
      },
    });
  }  

// ============== groupMatches =================
  for (const gm of groupMatches) {
    await prisma.groupMatch.upsert({
      where: { id: gm.id },
      update: {},
      create: {
        id: gm.id,
        round: gm.round,
        playerAId: gm.playerAId,
        playerBId: gm.playerBId,
        status: gm.status,
        groupId: gm.groupId,
      },
    });
  }

// ============== groupMatchResult =================
  for (const gmr of groupMatchResults) {
    await prisma.groupMatchResult.upsert({
      where: { id: gmr.id },
      update: {},
      create: {
        id: gmr.id,
        scoreA: gmr.scoreA,
        scoreB: gmr.scoreB,
        winnerId: gmr.winnerId,
        groupMatchId: gmr.groupMatchId,
      },
    });
  }

// ============== BRACKET =================
  for (const bracket of brackets) {
    await prisma.bracket.upsert({
      where: { id: bracket.id },
      update: {},
      create: {
        id: bracket.id,
        type: bracket.type,
        doubleElim: bracket.doubleElim,
        tournamentId: bracket.tournamentId,
      },
    });
  }

// ============== BracketMatch =================
  for (const bm of bracketMatches) {
    await prisma.bracketMatch.upsert({
      where: { id: bm.id },
      update: {},
      create: {
        id: bm.id,
        round: bm.round,
        status: bm.status,
        playerAId: bm.playerAId,
        playerBId: bm.playerBId,
        bracketId: bm.bracketId,
      },
    });
  }

// ============== BracketMatchResult =================
  for (const bmr of bracketMatchResults) {
    await prisma.bracketMatchResult.upsert({
      where: { id: bmr.id },
      update: {},
      create: {
        id: bmr.id,
        scoreA: bmr.scoreA,
        scoreB: bmr.scoreB,
        winnerId: bmr.winnerId,
        bracketMatchId: bmr.bracketMatchId,
      },
    });
  }

  console.log("✅ Сидирование завершено. Все данные фиксированные.");
}


main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });