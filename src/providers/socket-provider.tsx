"use client";

import {createContext, useContext, useEffect, useState,} from "react";
import { socket } from "~/lib/socket";

type SocketContextType = {
  socket: typeof socket;
  onlineUsers: Set<string>;
};
const SocketContext = createContext<SocketContextType>({socket,onlineUsers: new Set(),});

export const SocketProvider = ({ children,}: { children: React.ReactNode;}) => {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
    });

    socket.on("online_users",(users: string[]) => {
      setOnlineUsers(new Set(users));
    },);

    socket.on("user_online", ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);

        next.add(userId);

        return next;
      });
    },);

    socket.on("user_offline",({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    },);

    socket.on("disconnect", (reason) => {
      console.log("🔴 Socket disconnected:", reason);
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{socket,onlineUsers,}}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};







// "use client";

// import {createContext, useContext, useEffect,} from "react";
// import { socket } from "~/lib/socket";

// const SocketContext = createContext(socket);

// export const SocketProvider = ({ children,}: { children: React.ReactNode;}) => {
//   useEffect(() => {
//     socket.connect();

//     socket.on("connect", () => {
//       console.log("🟢 Socket connected:", socket.id);
//     });

//     socket.on("disconnect", (reason) => {
//       console.log("🔴 Socket disconnected:", reason);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   return (
//     <SocketContext.Provider value={socket}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocket = () => {
//   return useContext(SocketContext);
// };