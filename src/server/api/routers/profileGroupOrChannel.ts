import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { getId } from "~/app/api/auth/check";
import { TRPCError } from "@trpc/server";
import { ChatRole } from "@prisma/client";

export const profileGCPageRouter = createTRPCRouter({
  
    getGroupChannelInfo: protectedProcedure
    .input(z.object({
        id: z.string(),
    }))
    .query(async ({ ctx, input }) => {

        const chat = await ctx.db.chat.findUnique({
            where: {
                id: input.id,
            },
            select: {
                id: true,
                image: true,
                name: true,
                description: true,
                chatType: true,
                createdAt: true,
                members: {
                    select: {
                        id: true,
                        role: true,
                        user: {
                            select: {
                                id: true,
                                image: true,
                                firstname: true,
                                surname: true,
                                patronymic: true,
                                email: true,
                                role: true,
                            }
                        },
                    },
                },
            },
        });

        if (!chat) throw new TRPCError({code: "NOT_FOUND",});
        

        const sortedMembers = [...chat.members].sort((a, b) => {
        const rolePriority = {
            OWNER: 0,
            ADMIN: 1,
            USER: 2,
        };

        const roleCompare =
            rolePriority[a.role] - rolePriority[b.role];

        if (roleCompare !== 0) {
            return roleCompare;
        }

        const nameA =
            `${a.user.firstname ?? ""} ${a.user.surname ?? ""}`.toLowerCase();

        const nameB =
            `${b.user.firstname ?? ""} ${b.user.surname ?? ""}`.toLowerCase();

        return nameA.localeCompare(nameB);
        });

        return {
        ...chat,
        members: sortedMembers,
        };
    }),



    updateGroupChannel: protectedProcedure
  .input(
    z.object({
      chatId: z.string(),

      name: z.string(),

      description: z.string(),

      memberRoles: z.array(
        z.object({
          userId: z.string(),
          role: z.nativeEnum(ChatRole),
        })
      ).optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {

    const currentUserId = ctx.session.user.id;

    const currentMember =
      await ctx.db.chatMember.findFirst({
        where: {
          chatId: input.chatId,
          userId: currentUserId,
        },
      });

    if (
      !currentMember ||
      (
        currentMember.role !== ChatRole.OWNER &&
        currentMember.role !== ChatRole.ADMIN
      )
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
      });
    }

    await ctx.db.chat.update({
      where: {
        id: input.chatId,
      },

      data: {
        name: input.name,
        description: input.description,
      },
    });

    // OWNER может менять роли всем
    // ADMIN не может менять OWNER/ADMIN
    if (input.memberRoles?.length) {

      for (const memberRole of input.memberRoles) {

        const targetMember =
          await ctx.db.chatMember.findFirst({
            where: {
              chatId: input.chatId,
              userId: memberRole.userId,
            },
          });

        if (!targetMember) {
          continue;
        }

        // OWNER нельзя менять
        if (targetMember.role === ChatRole.OWNER) {
          continue;
        }

        // ADMIN не может менять ADMIN
        if (
          currentMember.role === ChatRole.ADMIN &&
          targetMember.role === ChatRole.ADMIN
        ) {
          continue;
        }

        await ctx.db.chatMember.update({
          where: {
            id: targetMember.id,
          },

          data: {
            role: memberRole.role,
          },
        });
      }
    }

    return {
      success: true,
    };
  }),

    
    deleteGroupChannel: protectedProcedure
    .input(
        z.object({
        chatId: z.string(),
        })
    )
    .mutation(async ({ ctx, input }) => {

        await ctx.db.chat.delete({
        where: {
            id: input.chatId,
        },
        });

        return true;
    }),

    addMembers: protectedProcedure
    .input(
        z.object({
        chatId: z.string(),
        userIds: z.array(z.string()),
        role: z.nativeEnum(ChatRole),
        })
    )
    .mutation(async ({ ctx, input }) => {
        await ctx.db.chat.update({
        where: { id: input.chatId },
        data: {
            members: {
            create: input.userIds.map((id) => ({
                userId: id,
                role: input.role,
            })),
            },
        },
        });
    }),

    deleteMembersFromChat: protectedProcedure
    .input(
        z.object({
        chatId: z.string(),
        memberIds: z.array(z.string()),
        })
    )
    .mutation(async ({ ctx, input }) => {

        const currentUserId = ctx.session.user.id;

        const currentMember =
        await ctx.db.chatMember.findFirst({
            where: {
            chatId: input.chatId,
            userId: currentUserId,
            },
        });

        if (
        !currentMember ||
        (
            currentMember.role !== ChatRole.OWNER &&
            currentMember.role !== ChatRole.ADMIN
        )
        ) {
        throw new TRPCError({
            code: "FORBIDDEN",
            message: "Недостаточно прав",
        });
        }

        // нельзя удалить OWNER
        const ownerMembers =
        await ctx.db.chatMember.findMany({
            where: {
            chatId: input.chatId,
            role: ChatRole.OWNER,
            userId: {
                in: input.memberIds,
            },
            },
        });

        if (ownerMembers.length > 0) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Нельзя удалить владельца",
        });
        }

        // ADMIN не может удалять ADMIN
        if (currentMember.role === ChatRole.ADMIN) {

        const admins =
            await ctx.db.chatMember.findMany({
            where: {
                chatId: input.chatId,
                role: ChatRole.ADMIN,
                userId: {
                in: input.memberIds,
                },
            },
            });

        if (admins.length > 0) {
            throw new TRPCError({
            code: "FORBIDDEN",
            message:
                "Администратор не может удалять других администраторов",
            });
        }
        }

        await ctx.db.chatMember.deleteMany({
        where: {
            chatId: input.chatId,
            userId: {
            in: input.memberIds,
            },
        },
        });

        return {
        success: true,
        };
    }),
});