import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { isAdmin, isOrganizer } from "~/app/api/auth/check";

export const homeRouter = createTRPCRouter({
  getParticipants: protectedProcedure
  .query(async ({ ctx }) => {
    return ctx.db.participant.findMany({
      include: {
        tournaments: {
          include: {
            tournament: true,
            groupMatchesAsA: true,
            groupMatchesAsB: true,
            bracketMatchesAsA: true,
            bracketMatchesAsB: true,
          },
        },
      },
    });
  }),

  createParticipant: protectedProcedure
  .input(
    z.object({
      firstname: z.string(),
      surname: z.string(),
      rating: z.number().optional(),
    })
  ) 
  .mutation(async ({ ctx, input }) => {
    if (!(await isAdmin()) && !(await isOrganizer())) throw new Error("Доступ запрещён");
    await ctx.db.participant.create({
      data: {
        firstname: input.firstname,
        surname: input.surname,
        rating: input.rating ? input.rating : 0
      },
    });
  }),

  deleteParticipant: protectedProcedure
  .input(
    z.object({
      id: z.string(),
    })
  ) 
  .mutation(async ({ ctx, input }) => {
    if (!(await isAdmin()) && !(await isOrganizer())) throw new Error("Доступ запрещён");
    await ctx.db.participant.delete({
      where: {
        id: input.id,
      }
    });
  }),

  updateParticipant: protectedProcedure
  .input(
    z.object({
      id: z.string(),
      firstname: z.string().optional(),
      surname: z.string().optional(),
      rating: z.number().optional(),
    })
  ) 
  .mutation(async ({ ctx, input }) => {
    if (!(await isAdmin()) && !(await isOrganizer())) throw new Error("Доступ запрещён");
    const data: {
      firstname?: string;
      surname?: string;
      rating?: number;
    } = {};

    if (input.firstname !== undefined) data.firstname = input.firstname;
    if (input.surname !== undefined) data.surname = input.surname;
    if (input.rating !== undefined) data.rating = input.rating;

    return await ctx.db.participant.update({
      where: {
        id: input.id,
      },
      data,
    });
     
  }),

});