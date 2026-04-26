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

//====================== НАЗВАНИЕ ==================
