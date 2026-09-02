import { AnyType } from '@/types/shared';

type attachType = {
  icon?: string;
  file?: string;
  fileSize?: string;
};

type MessageType = {
  createdAt?: AnyType;
  msg: string;
  senderId: number | string;
  type: string;
  attachment: attachType[];
  id: string;
};

export interface ChatsType {
  id: number | string;
  name: string;
  status: string;
  thumb: string;
  recent: boolean;
  excerpt: string;
  chatHistory?: AnyType[];
  messages: MessageType[];
}
