import type { Socket } from "socket.io";

import { db } from "~/server/db";
import type { SendMessageDto } from "../type";


export const registerMessageHandlers = (socket: Socket,) => {

    socket.on("send_message", async (data: SendMessageDto) => {
      try {
        const user = socket.data.user;
        const room = `chat:${data.chatId}`;

        // Сохраняем сообщение в БД
        const message = await db.message.create({
          data: {
            text: data.text,
            chatId: data.chatId,
            senderId: user.id,
          },
          include: {
            sender: true,
          },
        });
        socket.emit("message_delivered", {
          tempId: data.tempId,
          realId: message.id,
        });

        console.log(`✉️ ${user.email}: ${data.text}`,);

        // Отправка сообщения в комнату чата
        socket.to(room).emit("new_message",message,);

        // Отправляем обратно отправителю
        socket.emit("new_message",message,);

      } 
      catch(error) {
        console.error("❌ send_message error:",error,);
      }
    },);

};