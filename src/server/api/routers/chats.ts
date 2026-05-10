import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { getId } from "~/app/api/auth/check";
import { ChatType } from "@prisma/client";
import { TRPCError } from "@trpc/server";

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
                    role: true,
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




    // Создание канала информации
    createChannelAndGroup: protectedProcedure
    .input(
        z.object({
            name: z.string().min(1),
            description: z.string().optional(),
            memberIds: z.array(z.string()),
            chatType: z.enum(["CHANNEL", "GROUP"]),
        })
    )
    .mutation(async ({ ctx, input }) => {
        const creatorId = ctx.session.user.id;

        // creator всегда участник
        const uniqueMembers = Array.from(
        new Set([...input.memberIds, creatorId])
        );

        return await ctx.db.chat.create({
        data: {
            name: input.name,
            description: input.description,
            chatType: input.chatType,

            members: {
            create: uniqueMembers.map((userId) => ({
                userId,

                role:
                userId === creatorId
                    ? "OWNER"
                    : "USER",
            })),
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

  

    createDirect: protectedProcedure
    .input(
    z.object({
        targetUserId: z.string(),
    })
    )
    .mutation(async ({ ctx, input }) => {

    const currentUserId = ctx.session.user.id;

    // Нельзя создать чат с самим собой
    if (currentUserId === input.targetUserId) {
        throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Нельзя создать чат с самим собой",
        });
    }

    // Ищем существующий direct чат
    const existingChat = await ctx.db.chat.findFirst({
        where: {
        chatType: ChatType.DIRECT,

        AND: [
            {
            members: {
                some: {
                userId: currentUserId,
                },
            },
            },
            {
            members: {
                some: {
                userId: input.targetUserId,
                },
            },
            },
        ],
        },

        include: {
        members: {
            include: {
            user: true,
            },
        },
        },
    });

    // Если уже есть — возвращаем его
    if (existingChat) {
        return existingChat;
    }

    // Создаем новый direct чат
    return await ctx.db.chat.create({
        data: {
        chatType: ChatType.DIRECT,

        members: {
            create: [
            {
                userId: currentUserId,
            },
            {
                userId: input.targetUserId,
            },
            ],
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
    

    getUsers: protectedProcedure.query(async ({ ctx }) => {

    const currentUserId = ctx.session.user.id;

    return await ctx.db.user.findMany({
        where: {
        id: {
            not: currentUserId,
        },
        },

        select: {
        id: true,
        firstname: true,
        surname: true,
        image: true,
        email: true,
        },
    });
    }),

    getUsersForDirect: protectedProcedure
    .query(async ({ ctx }) => {

    const currentUserId = ctx.session.user.id;

    // Получаем все direct чаты пользователя
    const directChats = await ctx.db.chat.findMany({
        where: {
        chatType: ChatType.DIRECT,

        members: {
            some: {
            userId: currentUserId,
            },
        },
        },

        select: {
        members: {
            select: {
            userId: true,
            },
        },
        },
    });

    // ID пользователей с которыми уже есть direct
    const existingDirectUserIds = directChats.flatMap((chat) =>
        chat.members
        .map((m) => m.userId)
        .filter((id) => id !== currentUserId)
    );

    // Получаем пользователей
    return await ctx.db.user.findMany({
        where: {
        AND: [
            // исключаем самого себя
            {
            id: {
                not: currentUserId,
            },
            },

            // исключаем пользователей
            // с которыми уже есть direct
            {
            id: {
                notIn: existingDirectUserIds,
            },
            },
        ],
        },

        select: {
        id: true,
        firstname: true,
        surname: true,
        image: true,
        email: true,
        },
    });
    }),




    deleteDirect: protectedProcedure
    .input(
        z.object({
        chatId: z.string(),
        })
    )
    .mutation(async ({ ctx, input }) => {

        const currentUserId = ctx.session.user.id;

        // Проверяем что пользователь участник
        const chat = await ctx.db.chat.findFirst({
        where: {
            id: input.chatId,
            chatType: ChatType.DIRECT,

            members: {
            some: {
                userId: currentUserId,
            },
            },
        },
        });

        if (!chat) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Чат не найден",
        });
        }

        return await ctx.db.chat.delete({
        where: {
            id: input.chatId,
        },
        });
    }),

})