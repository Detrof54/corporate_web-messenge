import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { getId } from "~/app/api/auth/check";

export const userProfileRouter = createTRPCRouter({
  getUserById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.user.findUnique({
        where: { id: input.id },
        include: {
          tournaments: true,
        }
      });
    }),

  updateBaseProfile: publicProcedure
  .input(
    z.object({
      id: z.string(),
      firstname: z.string().min(1).nullable(),
      surname: z.string().min(1).nullable(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    if (!( await getId() === input.id)) throw new Error("Доступ запрещён");
    return ctx.db.user.update({
      where: { id: input.id },
      data: {
        firstname: input.firstname,
        surname: input.surname,
      },
    });
  }),

  deleteProfile: publicProcedure
  .input(
    z.object({
      id_user: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    if (!( await getId() === input.id_user)) throw new Error("Доступ запрещён");
    const { id_user} = input;
      await ctx.db.$transaction(async (tx) => {
      await tx.user.delete({
        where: { id: id_user },
      });
    });

    return { success: true };
  }),

});