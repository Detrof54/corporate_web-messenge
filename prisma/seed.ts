import { ChatType, PrismaClient,  } from "@prisma/client";
import path from "path";
import fs from "fs";
import { chatMember, chats, folder, folderChat, massage, massageRead, users } from "./data";

const prisma = new PrismaClient();

//функция удаления всех данных из БД
async function clearDb() {
  console.log("Удаляем старые данные...");
  await prisma.folderChat.deleteMany()
  await prisma.folder.deleteMany()
  await prisma.messageRead.deleteMany()
  await prisma.message.deleteMany()
  await prisma.chatMember.deleteMany()
  await prisma.chat.deleteMany()
  await prisma.user.deleteMany()

  console.log("🗑️ База очищена");
}

async function main() {
  await clearDb()     // Удаляем данные

  console.log("🌱 Сидирование фиксированных данных...");

// =====  USER =====
   for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: { 
        id: user.id, 
        firstname: user.firstname, 
        surname: user.surname,
        patronymic: user.patronymic,
        email: user.email,
        createdAt: user.createdAt,
        role: user.role,
      },
    })
  } 

//====================== CHAT ==================
  for (const chat of chats) {
    await prisma.chat.upsert({
      where: { id: chat.id },
      update: {},
      create: {
        id: chat.id,
        name: chat?.name,
        description: chat?.description,
        chatType: chat.chatType,
        createdAt: chat.createdAt,
      },
    });
  }

//=========== CHATMEMBER =====
  for (const cm of chatMember) {
    await prisma.chatMember.upsert({
      where: { id: cm.id },
      update: {},
      create: { 
        id: cm.id, 
        userId: cm.userId,
        chatId: cm.chatId,
        role: cm.role,
        joinedAt: cm.joinedAt,
        lastReadAt: cm.lastReadAt,
      },
    })
  }

//====================== MASSAGE ==================
  for (const m of massage) {
    await prisma.message.upsert({
      where: { id: m.id },
      update: {},
      create: {
        id: m.id,
        text: m.text,
        createdAt: m.createdAt,
        senderId: m.senderId,
        chatId: m.chatId,
      },
    });
  }

//====================== MASSAGEREAD ===============
  for (const mr of massageRead) {
    await prisma.messageRead.upsert({
      where: { id: mr.id },
      update: {},
      create: {
        id: mr.id,
        messageId: mr.messageId,
        userId: mr.userId,
        readAt: mr.readAt,
      },
    });
  }

//====================== FOLDER ==================
  for (const f of folder) {
    await prisma.folder.upsert({
      where: { id: f.id },
      update: {},
      create: {
        id: f.id,
        name: f.name,
        userId: f.userId,
      },
    });
  }

//====================== FOLDERCHAT ================
  for (const fc of folderChat) {
    await prisma.folderChat.upsert({
      where: { id: fc.id },
      update: {},
      create: {
        id: fc.id,
        chatId: fc.chatId,
        folderId: fc.folderId,
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