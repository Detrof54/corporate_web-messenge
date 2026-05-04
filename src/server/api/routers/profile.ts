import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { getId } from "~/app/api/auth/check";

export const userProfileRouter = createTRPCRouter({

  getInfoUserById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.user.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          image: true,
          firstname: true,
          surname: true,
          patronymic: true,
          email: true,
          createdAt: true,
          role: true,
        }
      });
    }),


  updateBaseProfile: publicProcedure
  .input(
    z.object({
      id: z.string(),
      firstname: z.string().min(1).nullable(),
      surname: z.string().min(1).nullable(),
      patronymic: z.string().min(1).nullable(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    if (!( await getId() === input.id)) throw new Error("Доступ запрещён");
    return ctx.db.user.update({
      where: { id: input.id },
      data: {
        firstname: input.firstname,
        surname: input.surname,
        patronymic: input.patronymic,
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