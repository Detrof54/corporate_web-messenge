import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { getId } from "~/app/api/auth/check";
import { TRPCError } from "@trpc/server";
import { ChatRole } from "@prisma/client";

export const administrationPageRouter = createTRPCRouter({

    getUsers: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.user.findMany({
            where: {},
            select: {
                id: true,
                firstname: true,
                surname: true,
                patronymic: true,
                email: true,
                createdAt: true,
                role: true,
            },
        });
    }),

    createUser: protectedProcedure
    .input(
        z.object({
            firstname: z.string().min(1),
            surname: z.string().min(1),
            patronymic: z.string().optional(),
            email: z.string().email(),
            role: z.enum(["ADMIN", "USER"]),
        })
    )
    .mutation(async ({ ctx, input }) => {

        const exists = await ctx.db.user.findUnique({
            where: {
                email: input.email,
            },
        });

        if (exists) {
            throw new TRPCError({
                code: "CONFLICT",
                message: "Пользователь уже существует",
            });
        }

        const user = await ctx.db.user.create({
            data: {
                firstname: input.firstname,
                surname: input.surname,
                patronymic: input.patronymic,
                email: input.email,
                role: input.role,
            },
        });

        return user;
    }),


    deleteUser: protectedProcedure
    .input(
        z.object({
            userId: z.string(),
        })
    )
    .mutation(async ({ ctx, input }) => {

        const user = await ctx.db.user.findUnique({
            where: {
                id: input.userId,
            },
        });

        if (!user) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Пользователь не найден",
            });
        }

        await ctx.db.chatMember.deleteMany({
            where: {
                userId: input.userId,
            },
        });

        await ctx.db.user.delete({
            where: {
                id: input.userId,
            },
        });

        return {
            success: true,
        };
    }),

    updateUser: protectedProcedure
    .input(
        z.object({
            userId: z.string(),
            firstname: z.string().min(1),
            surname: z.string().min(1),
            patronymic: z.string().optional(),
            email: z.string().email(),
            role: z.enum(["ADMIN", "USER"]),
        })
    )
    .mutation(async ({ ctx, input }) => {

        const user = await ctx.db.user.findUnique({
            where: {
                id: input.userId,
            },
        });

        if (!user) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Пользователь не найден",
            });
        }

        const exists = await ctx.db.user.findFirst({
            where: {
                email: input.email,
                NOT: {
                    id: input.userId,
                },
            },
        });

        if (exists) {
            throw new TRPCError({
                code: "CONFLICT",
                message: "Email уже используется",
            });
        }

        return await ctx.db.user.update({
            where: {
                id: input.userId,
            },
            data: {
                firstname: input.firstname,
                surname: input.surname,
                patronymic: input.patronymic,
                email: input.email,
                role: input.role,
            },
        });
    }),
})