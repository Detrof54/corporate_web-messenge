import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { getId } from "~/app/api/auth/check";

export const chatsRouter = createTRPCRouter({

    //Получение списка чатов
    getChats: protectedProcedure
    .input(z.object({
        folderId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {

        if (!input.folderId) {
            // список чатов пользователя 
            return ctx.db.chat.findMany({
                where: {
                    members: {
                        some: {
                            userId: ctx.session.user.id,
                        },
                    },
                },
                include: {
                    members: {
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    image: true,
                                    firstname: true,
                                    surname: true,
                                    patronymic: true,
                                }
                            },
                        }
                    },
                    messages: {
                        take: 1,
                        orderBy: { createdAt: "desc" },
                    },
                },
            });
        }

        //список чатов выбранной папки
        return ctx.db.chat.findMany({
            where: {
            folderChat: {
                some: {
                    folderId: input.folderId,
                },
            },
            },
            include: {
                members: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                image: true,
                                firstname: true,
                                surname: true,
                                patronymic: true,
                            }
                        },
                    }
                },
                messages: {
                    take: 1,
                    orderBy: { createdAt: "desc" },
                },
            },
        });
    }),

    //только сообщения чата
    getMessages: protectedProcedure
    .input(z.object({
        chatId: z.string(),
    }))
    .query(({ ctx, input }) => {
        return ctx.db.message.findMany({
        where: { chatId: input.chatId },
        orderBy: { createdAt: "asc" },
        include: {
            sender: true,
        },
        });
    }),

    // чат с его информацией (сообщения,)
    getChatInfo: publicProcedure
    .input(z.object({ chatId: z.string() }))
    .query(async ({ ctx, input }) => {
        return ctx.db.chat.findUnique({
        where: { id: input.chatId },
        select: {
            id: true,
            image: true,
            name:true,
            chatType: true,
            createdAt: true,
            members: {
                select: {
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
            },
        },
        });
    }),

})