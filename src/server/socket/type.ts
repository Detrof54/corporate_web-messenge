
export interface SocketUser {
  id: string;
  email: string;
  name?: string | null;
}

export interface SocketData {
  user: SocketUser;
  relatedUsers: string[];
}

export interface SendMessageDto {
  chatId: string;
  text: string;
}