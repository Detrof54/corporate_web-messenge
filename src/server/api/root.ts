
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { homeRouter } from "./routers/home";
import { tournametsRouter } from "./routers/tournamets";
import { userProfileRouter } from "./routers/profile";
import { tournametsBracketRouter } from "./routers/tournamentsBracket";


/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    homeRouter: homeRouter,
    tournametsRouter: tournametsRouter,
    userProfileRouter:userProfileRouter,
    tournametsBracketRouter:tournametsBracketRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
