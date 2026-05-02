import { ChatType } from "@prisma/client";

interface Messages {
  id: string;
  createdAt: Date;
  chatId: string;
  text: string;
  updateAt: Date | null;
  senderId: string;
}
interface Members {
  user: {
    id: string;
    firstname: string | null;
    surname: string | null;
    image: string | null;
    patronymic: string | null;
  };
}

interface Chat2 {
  members: Members[];
  chatType: ChatType;
  id: string;
  name: string | null;
  image: string | null;
  createdAt: Date;
}

interface Chat {
  members: Members[];
  messages: Messages[];
  chatType: ChatType;
  id: string;
  name: string | null;
  image: string | null;
  createdAt: Date;
  description: string | null;
}




// функция для отображения названия чата (для групп и каналов просто название, для диалога имя и фамилия собеседника)
export function getChatTitle(chat: Chat | Chat2, userId?: string) {
  if (chat.chatType === ChatType.DIRECT) {
    const other = chat.members.find((m: Members) => m.user.id !== userId);
    return other
      ? `${other.user.firstname ?? ""} ${other.user.surname ?? ""}`.trim()
      : "Пользователь";
  }
  return chat.name ?? "Без названия";
}

// функция для аватарки пользователя/группы/канала (если нет то берутся по умолчанию)
export function getChatAvatar(chat: Chat | Chat2, userId?: string) {
  if (chat.chatType === ChatType.DIRECT) {
    const other = chat.members.find((m: Members) => m.user.id !== userId);
    return other?.user.image ?? "/default-avatar.jpg";
  }
  if (chat.chatType === ChatType.GROUP) {
    return chat.image ?? "/default_group_chat2.jpeg";
  }
  if (chat.chatType === ChatType.CHANNEL) {
    return chat.image ?? "/default_chanel2.jpeg";
  }
  return "/default-avatar.jpg";
}

//Ограничиваем длинну последнего сообщения показываемого у чата
export function getPreview(text?: string) {
  if (!text) return "Нет сообщений";
  return text.length > 35 ? text.slice(0, 35) + "..." : text;
}

//функция для формирования времени в формате чч:мм
export function formatTime(date?: Date) {
  if (!date) return "";
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}