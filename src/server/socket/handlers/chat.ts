import type { Socket } from "socket.io";

export const registerChatHandlers = (
  socket: Socket,
) => {

  socket.on("join_chat", (chatId: string) => {
    const room = `chat:${chatId}`;

    socket.join(room);

    console.log(
      `➕ ${socket.data.user.email} joined ${room}`,
    );
  });

  socket.on("leave_chat", (chatId: string) => {
    const room = `chat:${chatId}`;

    socket.leave(room);

    console.log(
      `➖ ${socket.data.user.email} leave ${room}`,
    );
  });

};