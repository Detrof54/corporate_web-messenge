"use client";

import {createContext, useContext, useEffect,} from "react";
import { socket } from "~/lib/socket";

const SocketContext = createContext(socket);

export const SocketProvider = ({ children,}: { children: React.ReactNode;}) => {
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};