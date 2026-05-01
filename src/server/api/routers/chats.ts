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

})