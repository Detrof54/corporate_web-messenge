import type { Socket } from "socket.io";
import cookie from "cookie";

import { db } from "~/server/db";

export const socketAuthMiddleware = async (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  try {
    const cookies = cookie.parse(
      socket.request.headers.cookie ?? "",
    );

    const sessionToken = cookies["authjs.session-token"];

    if (!sessionToken) {
      console.log("❌ Нет session token");
      return next(new Error("Неавторизован"));
    }

    const session = await db.session.findUnique({
      where: {
        sessionToken,
      },
      include: {
        user: true,
      },
    });

    if (!session || !session.user) {
      console.log("❌ Session не найдена");
      return next(new Error("Неавторизован"));
    }

    socket.data.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.firstname ?? undefined,
    };

    console.log("🟢 SOCKET AUTH OK:", session.user.email);

    next();
  } catch (error) {
      console.error("❌ Socket auth error:", error);

      next(new Error("Ошибка аутентификации"));
  }
};


