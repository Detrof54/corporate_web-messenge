import { Server as HTTPServer } from "http"
import { Server } from "socket.io"
import { socketAuthMiddleware } from "./middleware/auth"
import { onlineUsers } from "./store";

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

    //добавление пользователей в список пользователей онлайн
    onlineUsers.set(socket.data.user.id, socket.id);

    console.log("ℹ️ ONLINE USERS:", onlineUsers)

    //Рассылка события того что пользователь в онлайн
    io?.emit("user_online", {
      userId: socket.data.user.id,
    });

    socket.on("disconnect", () => {
      console.log("🔴Disconnected:", socket.data.user.email);
      // Удаление пользователя из списка онлайн при отключении
      onlineUsers.delete(socket.data.user.id);
      console.log("ℹ️ ONLINE USERS:", onlineUsers);

      //Рассылка события того что пользователь в оффлайн
      io?.emit("user_offline", {
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


