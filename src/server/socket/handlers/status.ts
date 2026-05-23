import { onlineUsers } from "../store";

export const addOnlineUser = (
  userId: string,
  socketId: string,
) => {
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
  }

  onlineUsers.get(userId)?.add(socketId);
};

export const removeOnlineUser = (
  userId: string,
  socketId: string,
) => {
  const sockets = onlineUsers.get(userId);

  if (!sockets) {
    return false;
  }

  sockets.delete(socketId);

  if (sockets.size === 0) {
    onlineUsers.delete(userId);

    return true; 
  }

  return false;
};

export const isUserOnline = (userId: string) => {
  return onlineUsers.has(userId);
};