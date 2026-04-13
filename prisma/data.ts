import {BracketType, MatchStatus, Role, TiebreakType, TypeStage } from "@prisma/client";

//====================== USER ==================
//Таблица User 
export const users = [
    {
        id: "user1",
        firstname: "Юзер1",
        surname: "Юзеров1",
        email: "user1@err.com",
        role: Role.USER,
    },
]
//Таблица User (админы)
export const admins = [
    {
        id: "admin1",
        firstname: "Админ1",
        surname: "Админов1",
        email: "admin1@err.com",
        role: Role.ADMIN,
    },
]
//Таблица User (организатор)
export const organizer = [
    {
        id: "organizer1",
        firstname: "Организатор1",
        surname: "Организаторов1",
        email: "organizer1@err.com",
        role: Role.ORGANIZER,
    },
]

//====================== PARTICIPANT ==================
export const participants = [
  {
    id: "participant1",
    firstname: "Иван",
    surname: "Иванов",
    rating: 1500,
  },
  {
    id: "participant2",
    firstname: "Пётр",
    surname: "Петров",
    rating: 1450,
  },
  {
    id: "participant3",
    firstname: "Сергей",
    surname: "Сергеев",
    rating: 1600,
  },
  {
    id: "participant4",
    firstname: "Дмитрий",
    surname: "Смирнов",
    rating: 1450,
  },
  {
    id: "participant5",
    firstname: "Андрей",
    surname: "Кузнецов",
    rating: 1580,
  },
  {
    id: "participant6",
    firstname: "Михаил",
    surname: "Волков",
    rating: 1520,
  },
  {
    id: "participant7",
    firstname: "Никита",
    surname: "Фёдоров",
    rating: 1480,
  },
  {
    id: "participant8",
    firstname: "Евгений",
    surname: "Морозов",
    rating: 1620,
  },
  {
    id: "participant9",
    firstname: "Павел",
    surname: "Соколов",
    rating: 1490,
  },
  {
    id: "participant10",
    firstname: "Владимир",
    surname: "Орлов",
    rating: 1570,
  },
]

//================= TURNIR ==================
export const turnirs = [
  {
    id: "turnir1",
    nameTurnir: "Кубок города",
    description: "Тестовый турнир",
    stage: TypeStage.FINISHED,
    participantsCount: 8,
    groupsCount: 2,
    tiebreakType: TiebreakType.HEAD_TO_HEAD,
    createdById: "organizer1",
  },
]

//================= TurnirParticipant ==================
export const turnirParticipants = [
  //турнир 1
  {
    id: "tp1",
    // points:
    // wins:
    // defeat:
    // scoreFor:
    // scoreAgainst:
    participantId: "participant1",
    tournamentId: "turnir1",
    groupId: "group1",
  },
  {
    id: "tp2",
    // points:
    // wins:
    // defeat:
    // scoreFor:
    // scoreAgainst:
    participantId: "participant2",
    tournamentId: "turnir1",
    groupId: "group1",
  },
  {
    id: "tp3",
    // points:
    // wins:
    // defeat:
    // scoreFor:
    // scoreAgainst:
    participantId: "participant3",
    tournamentId: "turnir1",
    groupId: "group1",
  },
  {
    id: "tp4",
    // points:
    // wins:
    // defeat:
    // scoreFor:
    // scoreAgainst:
    participantId: "participant4",
    tournamentId: "turnir1",
    groupId: "group1",
  },
  {
    id: "tp5",
    // points:
    // wins:
    // defeat:
    // scoreFor:
    // scoreAgainst:
    participantId: "participant5",
    tournamentId: "turnir1",
    groupId: "group2",
  },
  {
    id: "tp6",
    // points:
    // wins:
    // defeat:
    // scoreFor:
    // scoreAgainst:
    participantId: "participant6",
    tournamentId: "turnir1",
    groupId: "group2",
  },
  {
    id: "tp7",
    // points:
    // wins:
    // defeat:
    // scoreFor:
    // scoreAgainst:
    participantId: "participant7",
    tournamentId: "turnir1",
    groupId: "group2",
  },
  {
    id: "tp8",
    // points:
    // wins:
    // defeat:
    // scoreFor:
    // scoreAgainst:
    participantId: "participant8",
    tournamentId: "turnir1",
    groupId: "group2",
  },
]

//================= GROUP ==================
export const groups = [
  {
    id: "group1",
    name: "Группа A",
    tournamentId: "turnir1",
  },
  {
    id: "group2",
    name: "Группа B",
    tournamentId: "turnir1",
  },
]

 
//================= groupMatches ==================
export const groupMatches = [
// 1 тур
  //группа 1
  {
    id: "gm1",
    round: 1,
    playerAId: "tp1",
    playerBId: "tp2",
    status: MatchStatus.FINISHED,
    groupId: "group1",
  },
  {
    id: "gm2",
    round: 1,
    playerAId: "tp3",
    playerBId: "tp4",
    status: MatchStatus.FINISHED,
    groupId: "group1",
  },
  //группа 2
  {
    id: "gm3",
    round: 1,
    playerAId: "tp5",
    playerBId: "tp6",
    status: MatchStatus.FINISHED,
    groupId: "group2",
  },
  {
    id: "gm4",
    round: 1,
    playerAId: "tp7",
    playerBId: "tp8",
    status: MatchStatus.FINISHED,
    groupId: "group2",
  },
  // 2 тур
    //группа 1
  {
    id: "gm5",
    round: 2,
    playerAId: "tp1",
    playerBId: "tp3",
    status: MatchStatus.FINISHED,
    groupId: "group1",
  },
  {
    id: "gm6",
    round: 2,
    playerAId: "tp2",
    playerBId: "tp4",
    status: MatchStatus.FINISHED,
    groupId: "group1",
  },
  //группа 2
  {
    id: "gm7",
    round: 2,
    playerAId: "tp5",
    playerBId: "tp7",
    status: MatchStatus.FINISHED,
    groupId: "group2",
  },
  {
    id: "gm8",
    round: 2,
    playerAId: "tp6",
    playerBId: "tp8",
    status: MatchStatus.FINISHED,
    groupId: "group2",
  },
// 3 тур
  //группа 1
  {
    id: "gm9",
    round: 3,
    playerAId: "tp1",
    playerBId: "tp4",
    status: MatchStatus.FINISHED,
    groupId: "group1",
  },
  {
    id: "gm10",
    round: 3,
    playerAId: "tp2",
    playerBId: "tp3",
    status: MatchStatus.FINISHED,
    groupId: "group1",
  },
  //группа 2
  {
    id: "gm11",
    round: 3,
    playerAId: "tp5",
    playerBId: "tp8",
    status: MatchStatus.FINISHED,
    groupId: "group2",
  },
  {
    id: "gm12",
    round: 3,
    playerAId: "tp6",
    playerBId: "tp7",
    status: MatchStatus.FINISHED,
    groupId: "group2",
  },

  //ДОП МАТЧ
  {
    id: "gm13",
    round: 0,
    playerAId: "tp1",
    playerBId: "tp2",
    status: MatchStatus.FINISHED,
    groupId: "group1",
  },
  {
    id: "gm14",
    round: 0,
    playerAId: "tp4",
    playerBId: "tp2",
    status: MatchStatus.FINISHED,
    groupId: "group1",
  },
  {
    id: "gm15",
    round: 0,
    playerAId: "tp1",
    playerBId: "tp4",
    status: MatchStatus.FINISHED,
    groupId: "group1",
  },
]


//================= groupMatchResult ==================
export const groupMatchResults = [
  // 1 тур
  {
    id: "gmr1",
    scoreA: 2,
    scoreB: 1,
    winnerId: "tp1",
    groupMatchId: "gm1",
  },
  {
    id: "gmr2",
    scoreA: 2,
    scoreB: 3,
    winnerId: "tp4",
    groupMatchId: "gm2",
  },
  {
    id: "gmr3",
    scoreA: 5,
    scoreB: 4,
    winnerId: "tp5",
    groupMatchId: "gm3",
  },
  {
    id: "gmr4",
    scoreA: 4,
    scoreB: 3,
    winnerId: "tp7",
    groupMatchId: "gm4",
  },

  // 2 тур
  {
    id: "gmr5",
    scoreA: 5,
    scoreB: 1,
    winnerId: "tp1",
    groupMatchId: "gm5",
  },
  {
    id: "gmr6",
    scoreA: 2,
    scoreB: 1,
    winnerId: "tp2",
    groupMatchId: "gm6",
  },
  {
    id: "gmr7",
    scoreA: 5,
    scoreB: 1,
    winnerId: "tp5",
    groupMatchId: "gm7",
  },
  {
    id: "gmr8",
    scoreA: 2,
    scoreB: 1,
    winnerId: "tp6",
    groupMatchId: "gm8",
  },
// 3 тур
  {
    id: "gmr9",
    scoreA: 5,
    scoreB: 6,
    winnerId: "tp4",
    groupMatchId: "gm9",
  },
  {
    id: "gmr10",
    scoreA: 2,
    scoreB: 1,
    winnerId: "tp2",
    groupMatchId: "gm10",
  },
  {
    id: "gmr11",
    scoreA: 5,
    scoreB: 1,
    winnerId: "tp5",
    groupMatchId: "gm11",
  },
  {
    id: "gmr12",
    scoreA: 2,
    scoreB: 4,
    winnerId: "tp7",
    groupMatchId: "gm12",
  },

  //ДОП МАТЧ результат
  {
    id: "gmr13",
    scoreA: 4,
    scoreB: 2,
    winnerId: "tp1",
    groupMatchId: "gm13",
  },
  {
    id: "gmr14",
    scoreA: 4,
    scoreB: 1,
    winnerId: "tp4",
    groupMatchId: "gm14",
  },
  {
    id: "gmr15",
    scoreA: 4,
    scoreB: 3,
    winnerId: "tp1",
    groupMatchId: "gm15",
  },
]

//================= BRACKET ==================
export const brackets = [
  {
    id: "bracket1",
    type: BracketType.UPPER,
    doubleElim: true,
    tournamentId: "turnir1",
  },
  {
    id: "bracket2",
    type: BracketType.LOWER,
    doubleElim: false,
    tournamentId: "turnir1",
  },
  {
    id: "bracket3",
    type: BracketType.CONSOLATION,
    doubleElim: true,
    tournamentId: "turnir1",
  },
]

//================= BracketMatch ==================
export const bracketMatches = [
  //для верхней
  {
    id: "bm1",
    round: 1,
    playerAId: "tp1",
    playerBId: "tp5",
    bracketId: "bracket1",
    status: MatchStatus.FINISHED,
  },

  //для нижней
  {
    id: "bm2",
    round: 1,
    playerAId: "tp4",
    playerBId: "tp7",
    bracketId: "bracket2",
    status: MatchStatus.FINISHED,
  },
  {
    id: "bm3",
    round: 1,
    playerAId: "tp2",
    playerBId: "tp6",
    bracketId: "bracket2",
    status: MatchStatus.FINISHED,
  },
  {
    id: "bm4",
    round: 2,
    playerAId: "tp2",
    playerBId: "tp7",
    bracketId: "bracket2",
    status: MatchStatus.FINISHED,
  },
  //для утешительной
  {
    id: "bm5",
    round: 1,
    playerAId: "tp3",
    playerBId: "tp8",
    bracketId: "bracket3",
    status: MatchStatus.FINISHED,
  },
  //Доп матчи
  //матч за 5 (6) место
  {
    id: "bm6",
    round: 0,
    playerAId: "tp6",
    playerBId: "tp4",
    bracketId: "bracket2",
    status: MatchStatus.FINISHED,
  },
]

// ============== BracketMatchResult =================
export const bracketMatchResults = [
  //для верхней
  {
    id: "bmr1",
    scoreA: 3,
    scoreB: 3,
    winnerId: null,
    bracketMatchId: "bm1",
  },
  {
    id: "bmr2",
    scoreA: 4,
    scoreB: 2,
    winnerId: "tp1",
    bracketMatchId: "bm1",
  },
  //для нижней
  {
    id: "bmr3",
    scoreA: 3,
    scoreB: 5,
    winnerId: "tp7",
    bracketMatchId: "bm2",
  },
  {
    id: "bmr4",
    scoreA: 4,
    scoreB: 2,
    winnerId: "tp2",
    bracketMatchId: "bm3",
  },
  {
    id: "bmr5",
    scoreA: 4,
    scoreB: 2,
    winnerId: "tp2",
    bracketMatchId: "bm4",
  },
  //для утешительной
  {
    id: "bmr6",
    scoreA: 3,
    scoreB: 5,
    winnerId: "tp8",
    bracketMatchId: "bm5",
  },
  //Доп матчи
  {
    id: "bmr7",
    scoreA: 2,
    scoreB: 1,
    winnerId: "tp6",
    bracketMatchId: "bm6",
  },
]