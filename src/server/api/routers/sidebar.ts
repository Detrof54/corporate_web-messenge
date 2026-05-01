import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { getId } from "~/app/api/auth/check";

export const sidebarRouter = createTRPCRouter({
  
    getListFolders: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.user.findUnique({
        where: { id: ctx.session?.user.id },
        select: {
            folder: {
                select: {
                    id: true,
                    name: true,
                }
            },
        }
      });
    }),

})