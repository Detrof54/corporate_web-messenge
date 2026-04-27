import { RoleSystem, ChatType, ChatRole } from "@prisma/client";

//====================== USER ==================
//Таблица User 
export const users = [
    {
        id: "user1",
        firstname: "Олег",
        surname: "Сахаров",
        patronymic: "Григорьевич",
        email: "oleg@megalule.com",
        createdAt: new Date('2026-04-27T15:30:00'),
        role: RoleSystem.USER,
    },
    {
        id: "user2",
        firstname: "Глеб",
        surname: "Громов",
        patronymic: "Алекберович",
        email: "gromov@megalule.com",
        createdAt: new Date('2026-04-27T15:30:00'),
        role: RoleSystem.USER,
    },
    {
        id: "user3",
        firstname: "Семен",
        surname: "Петров",
        patronymic: "Валерьевич",
        email: "petrov@megalule.com",
        createdAt: new Date('2026-04-27T15:30:00'),
        role: RoleSystem.USER,
    },
    {
        id: "user4",
        firstname: "Валерий",
        surname: "Смальков",
        patronymic: "Петрович",
        email: "smalkov@megalule.com",
        createdAt: new Date('2026-04-27T19:30:00'),
        role: RoleSystem.USER,
    },
    {
        id: "admin1",
        firstname: "Костя",
        surname: "Шмелев",
        patronymic: "Генадьевич",
        email: "shmelev@megalule.com",
        createdAt: new Date('2025-04-22T18:30:00'),
        role: RoleSystem.ADMIN,
    },
]

//====================== CHATMEMBER ==================
export const chatMember = [
    //Пользователи чата 1 (личный чат)
    {
        id: "chatMember1",
        userId: "user1",
        chatId: "chat1",
        role: ChatRole.USER,
        joinedAt: new Date('2026-04-27T15:30:00'),
        lastReadAt: new Date('2026-04-27T18:30:00'),
    },
    {
        id: "chatMember2",
        userId: "user2",
        chatId: "chat1",
        role: ChatRole.USER,
        joinedAt: new Date('2026-04-27T15:30:00'),
        lastReadAt: new Date('2026-04-27T19:30:00'),
    },

    //Пользователи чата 2 (групповой чат)
    {
        id: "chatMember3",
        userId: "user1",
        chatId: "chat2",
        role: ChatRole.ADMIN,
        joinedAt: new Date('2026-04-27T15:30:00'),
        lastReadAt: new Date('2026-04-27T18:30:00'),
    },
    {
        id: "chatMember4",
        userId: "user2",
        chatId: "chat2",
        role: ChatRole.USER,
        joinedAt: new Date('2026-04-27T15:30:00'),
        lastReadAt: new Date('2026-04-27T19:36:00'),
    },
    {
        id: "chatMember5",
        userId: "user3",
        chatId: "chat2",
        role: ChatRole.USER,
        joinedAt: new Date('2026-04-27T15:30:00'),
        lastReadAt: new Date('2026-04-27T19:55:00'),
    },
    
    //Пользователи чата 3 (канал чат)
    {
        id: "chatMember6",
        userId: "user1",
        chatId: "chat3",
        role: ChatRole.ADMIN,
        joinedAt: new Date('2026-04-27T15:30:00'),
        lastReadAt: new Date('2026-04-27T18:30:00'),
    },
    {
        id: "chatMember7",
        userId: "user2",
        chatId: "chat3",
        role: ChatRole.USER,
        joinedAt: new Date('2026-04-27T15:30:00'),
        lastReadAt: new Date('2026-04-27T19:36:00'),
    },
    {
        id: "chatMember8",
        userId: "user3",
        chatId: "chat3",
        role: ChatRole.USER,
        joinedAt: new Date('2026-04-27T15:30:00'),
        lastReadAt: new Date('2026-04-27T19:55:00'),
    },
]

//====================== CHAT ==================
export const chats = [
    {
        id: "chat1",
        chatType: ChatType.DIRECT,
        createdAt: new Date(),
    },
    {
        id: "chat2",
        name: "Бухгалтерия",
        description: "Отдел бухгалтерии, обсуждение финансов",
        chatType: ChatType.GROUP,
        createdAt: new Date(),
    },
    {
        id: "chat3",
        name: "Информация бухгалтерии",
        description: "Основная информаци отдела бухгалтерии",
        chatType: ChatType.CHANNEL,
        createdAt: new Date(),
    },
]

//====================== MASSAGE ==================
export const massage = [
    //Сообщения чата 1 (личный сообщения)
    {
        id: "massage1",
        text: "Привет, теперь общение будет тут",
        createdAt: new Date('2026-04-27T15:33:00'),
        senderId: "user1",
        chatId: "chat1",
    },
    {
        id: "massage2",
        text: "Привет, ясно",
        createdAt: new Date('2026-04-27T15:37:00'),
        senderId: "user2",
        chatId: "chat1",
    },
    //Сообщения чата 2 (сообщения группы)
    {
        id: "massage3",
        text: "Привет, теперь общение будет тут",
        createdAt: new Date('2026-04-27T15:33:00'),
        senderId: "user1",
        chatId: "chat2",
    },
    {
        id: "massage4",
        text: "Привет, ясно",
        createdAt: new Date('2026-04-27T15:37:00'),
        senderId: "user2",
        chatId: "chat2",
    },
    {
        id: "massage5",
        text: "Привет, Понятно",
        createdAt: new Date('2026-04-27T15:38:00'),
        senderId: "user3",
        chatId: "chat2",
    },
    //Сообщения чата 3 (сообщения канала)
    {
        id: "massage6",
        text: "Сегодня всем нужно быть в конференц зале",
        createdAt: new Date('2026-04-28T15:33:00'),
        senderId: "user1",
        chatId: "chat2",
    },
]

//====================== MASSAGEREAD ==================
export const massageRead = [
    //Сообщения чата 3 (канал)
    {
        id: "massageRead1",
        messageId: "massage6",
        userId: "user1",
        readAt: new Date('2026-04-28T15:33:00'),
    },
    {
        id: "massageRead2",
        messageId: "massage6",
        userId: "user2",
        readAt: new Date('2026-04-28T16:00:00'),
    },
    {
        id: "massageRead3",
        messageId: "massage6",
        userId: "user3",
        readAt: new Date('2026-04-28T17:00:00'),
    },
]

//====================== FOLDERCHAT ==================
export const folderChat = [
    {
        id: "folderChat1",
        chatId: "chat2",
        folderId: "folder1",
    },
    {
        id: "folderChat2",
        chatId: "chat3",
        folderId: "folder1",
    },
    {
        id: "folderChat3",
        chatId: "chat1",
        folderId: "folder2",
    },
]

//====================== FOLDER ==================
export const folder = [
    {
        id: "folder1",
        name: "Отдел бухгалтерии",
        userId: "user1",
    },
    {
        id: "folder2",
        name: "Переписки с коллегами",
        userId: "user1",
    },
]

