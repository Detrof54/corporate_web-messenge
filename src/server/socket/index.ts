import { Server as HTTPServer } from "http"
import { Server } from "socket.io"

let io: Server | null = null    

export const initSocket = (server: HTTPServer) => {
  if (io) return io    

  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",    
      credentials: true,                  
    },
  })

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id)

    socket.on("disconnect", (reason) => {            
      console.log("User disconnected:", socket.id)
      console.log("Reason:", reason)
    })
  })

  return io      
}

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized")
  }

  return io
}