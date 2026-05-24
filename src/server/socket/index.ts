import { Server as HTTPServer } from "http"
import { Server } from "socket.io"
import { socketAuthMiddleware } from "./middleware/auth"
import { onlineUsers } from "./store";
import { registerChatHandlers } from "./handlers/chat";
import { addOnlineUser, removeOnlineUser } from "./handlers/status";
import { db } from "../db";
import type { SocketData } from "./type";
import { registerMessageHandlers } from "./handlers/messege";

let io: Server | null = null    

export const initSocket = (server: HTTPServer) => {
  if (io) return io    

  io = new Server<SocketData>(server, {
    cors: {
      origin: "http://localhost:3000",    
      credentials: true,                  
    },

    pingTimeout: 20000,
    pingInterval: 25000,
  })

  io.use(socketAuthMiddleware);

  io.on("connection", async (socket) => {
    const user = socket.data.user;

    console.log("🟢Connected user:", user.email);
    
    registerChatHandlers(socket);         //Добавление в комнату чата
    registerMessageHandlers(socket);      //отправка сообщения

    socket.join(`user:${user.id}`);
    addOnlineUser(user.id, socket.id)
    const memberships = await db.chatMember.findMany({
      where: {
        userId: user.id,
      },
      include: {
        chat: {
          include: {
            members: true,
          },
        },
      },
    });
    const relatedUsers = new Set<string>();
    for (const membership of memberships) {
      for (const member of membership.chat.members) {
        if (member.userId !== user.id) {
          relatedUsers.add(member.userId);
        }
      }
    }

    socket.data.relatedUsers = [...relatedUsers]

    for (const relatedUserId of relatedUsers) {
      io?.to(`user:${relatedUserId}`).emit("user_online", {
        userId: user.id,
      });
    }                       


    const onlineRelatedUsers = [...relatedUsers].filter((id) =>
      onlineUsers.has(id),
    );

    socket.emit("online_users", onlineRelatedUsers);

    console.log("ℹ️ ONLINE USERS:", onlineUsers)

    socket.on("disconnect", () => {
      console.log("🔴Disconnected:", user.email);
      
      const becameOffline = removeOnlineUser(user.id, socket.id,);
      if (!becameOffline) {
        return;
      }

      for (const relatedUserId of socket.data.relatedUsers){
        io?.to(`user:${relatedUserId}`).emit("user_offline",{
          userId: user.id,
        });
      }

      console.log("ℹ️ ONLINE USERS:", onlineUsers);
    });
  });

  return io      
}

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized")
  }

  return io
}


