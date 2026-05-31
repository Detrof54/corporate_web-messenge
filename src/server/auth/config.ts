import { PrismaAdapter } from "@auth/prisma-adapter";
import type { $Enums } from "@prisma/client";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import EmailProvider from "next-auth/providers/nodemailer";

import { sendVerificationRequest } from "~/mailers/auth-mailer";
import { db } from "~/server/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: $Enums.RoleSystem;
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  adapter: PrismaAdapter(db),

  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    }),
  ],

  pages: {
    signIn: "/login", 
  },

  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        return false;
      }

      const existingUser = await db.user.findUnique({
        where: {
          email: user.email,
        },
      });

      return !!existingUser;        // разрешаем вход только существующим пользователям
    },

    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
} satisfies NextAuthConfig;








// до изменений
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import type { $Enums } from "@prisma/client";
// import { type DefaultSession, type NextAuthConfig } from "next-auth";
// import EmailProvider from "next-auth/providers/nodemailer";
// import { sendVerificationRequest } from "~/mailers/auth-mailer";
// import { db } from "~/server/db";

// /**
//  * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
//  * object and keep type safety.
//  *
//  * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
//  */
// declare module "next-auth" {
//   interface Session extends DefaultSession {
//     user: {
//       id: string;
//       // ...other properties
//       role: $Enums.RoleSystem;
//     } & DefaultSession["user"];
//   }

//   // interface User {
//   //   // ...other properties
//   //   role: $Enums.RoleSystem;
//   // }
// }



// /**
//  * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
//  *
//  * @see https://next-auth.js.org/configuration/options
//  */
// export const authConfig = {
//   providers: [
//     EmailProvider({
//       server: process.env.EMAIL_SERVER,
//       from: process.env.EMAIL_FROM,
//       sendVerificationRequest: sendVerificationRequest,
//     })
//   ],
//   adapter: PrismaAdapter(db),
//   callbacks: {
//     session: ({ session, user }) => ({
//       ...session,
//       user: {
//         ...session.user,
//         id: user.id,
//       },
//     }),
//   },
// } satisfies NextAuthConfig;

