import { Server as HTTPServer } from "http"
import { Server } from "socket.io"
import { socketAuthMiddleware } from "./middleware/auth"
import { onlineUsers } from "./store";
import { registerChatHandlers } from "./handlers/chat";

let io: Server | null = null    

export const initSocket = (server: HTTPServer) => {
  if (io) return io    

  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",    
      credentials: true,                  
    },
  })

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    console.log("🟢Connected user:", socket.data.user);

    onlineUsers.set(socket.data.user.id, socket.id);      //добавление пользователей в список пользователей онлайн
    registerChatHandlers(socket);                         //

    console.log("ℹ️ ONLINE USERS:", onlineUsers)

    io?.emit("user_online", {     //Рассылка события того что пользователь в онлайн
      userId: socket.data.user.id,
    });



    socket.on("disconnect", () => {
      console.log("🔴Disconnected:", socket.data.user.email);
      
      onlineUsers.delete(socket.data.user.id);            // Удаление пользователя из списка онлайн при отключении
      console.log("ℹ️ ONLINE USERS:", onlineUsers);

      io?.emit("user_offline", {            //Рассылка события того что пользователь в оффлайн
        userId: socket.data.user.id,
      });
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


