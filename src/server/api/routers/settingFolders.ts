import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { getId } from "~/app/api/auth/check";

export const settingFolderRouter = createTRPCRouter({
    // Получение списка папок пользователя
    getFolderList: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.user.findUnique({
        where: { id: input.id },
        select: {
            folder: {
                select: {
                    id: true,
                    name: true,
                    folderChat: {
                        select: {
                            id: true,
                        }
                    }
                }
            },
        }
      });
    }),

    // Получение списка чатов в папке
    getFolderChats: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.folder.findUnique({
        where: { id: input.id },
        select: {
            folderChat: {
                select: {
                    chat: {
                        select: {
                            id: true,
                            image: true,
                            name: true,
                            chatType: true,
                            members: {
                                select:{
                                    id: true,
                                    user: {
                                        select: {
                                            id: true,
                                            image: true,
                                            firstname: true,
                                            surname: true,
                                            patronymic: true,
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
      });
    }),

    // Удаление чата из папки
    removeChatFromFolder: publicProcedure
    .input(z.object({
        folderId: z.string(),
        chatId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
        return ctx.db.folderChat.deleteMany({
            where: {
                folderId: input.folderId,
                chatId: input.chatId,
            },
        });
    }),

    //Удаление папки
    deleteFolder: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
        return ctx.db.folder.delete({
        where: { id: input.id },
        });
    }),

    // Получение чатов пользователя
    getUserChats: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
        return ctx.db.chat.findMany({
        where: {
            members: {
            some: {
                userId: input.userId,
            },
            },
        },
        include: {
            members: {
            include: {
                user: true,
            },
            },
        },
        });
    }),

    //Добавление чатов в папку
    addChatToFolder: publicProcedure
    .input(z.object({
        folderId: z.string(),
        chatId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
        return ctx.db.folderChat.create({
        data: {
            folderId: input.folderId,
            chatId: input.chatId,
        },
        });
    }),

    updateFolderName: publicProcedure
    .input(z.object({
        id: z.string(),
        name: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
        return ctx.db.folder.update({
        where: { id: input.id },
        data: { name: input.name },
        });
    }),

    createFolder: publicProcedure
    .input(z.object({
        userId: z.string(),
        name: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
        return ctx.db.folder.create({
        data: {
            name: input.name,
            userId: input.userId,
        },
        });
    }),

})