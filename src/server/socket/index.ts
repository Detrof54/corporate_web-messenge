//новое
import { Server as HTTPServer } from "http"
import { Server } from "socket.io"
import { socketAuthMiddleware } from "./middleware/auth"

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

    socket.on("disconnect", () => {
      console.log("🔴Disconnected:", socket.data.user.id);
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





// старое
// import { Server as HTTPServer } from "http"
// import { Server } from "socket.io"

// let io: Server | null = null    // Глобальная переменная для хранения единственного экземпляра socket.io.

// // Функция инициализации socket.io. Принимает уже существующий HTTP сервер (тот, на котором работает Next.js).
// export const initSocket = (server: HTTPServer) => {
//   if (io) return io    //защита от пересоздания

// // Создаем socket.io сервер
//   io = new Server(server, {
//     // Настройки CORS для websocket/polling запросов
//     cors: {
//       origin: "http://localhost:3000",    // Разрешаем подключения только с frontend на localhost:3000.
//       credentials: true,                  // Разрешаем отправку cookies/auth headers.
//     },
//   })

//   // Событие нового подключения клиента. Срабатывает каждый раз,когда frontend подключается через socket.io-client.
//   io.on("connection", (socket) => {
//     console.log("🔵User connected:", socket.id)

//     socket.on("disconnect", (reason) => {             // Слушаем событие отключения клиента.
//       console.log("🔴User disconnected:", socket.id)
//       console.log("🟠Reason:", reason)
//     })
//   })

//   return io       // Возвращаем экземпляр socket.io сервера.
// }

// // Функция для получения текущего экземпляра socket.io из любого места проекта.
// export const getIO = () => {
//   if (!io) {
//     throw new Error("‼️Socket.io not initialized")
//   }

//   return io
// }
