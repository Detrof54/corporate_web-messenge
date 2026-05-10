
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userProfileRouter } from "./routers/profile";
import { sidebarRouter } from "./routers/sidebar";
import { chatsRouter } from "./routers/chats";
import { settingFolderRouter } from "./routers/settingFolders";
import { profileGCPageRouter } from "./routers/profileGroupOrChannel";



/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    sidebar: sidebarRouter,
    profile: userProfileRouter,
    chats: chatsRouter,
    settingFolder: settingFolderRouter,
    profileGC: profileGCPageRouter,
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
