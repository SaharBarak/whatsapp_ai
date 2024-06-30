import whatsappClient from '../clients/whatsappClient.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Chat as WWebJSChat, Message as WWebJSMessage } from 'whatsapp-web.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imageDir = path.join(__dirname, '../../public/images');

interface GroupHeader {
  name: string;
}

interface Message extends WWebJSMessage {
  description?: string;
}

type Group = WWebJSChat & {
  fetchMessages: (options: { limit: number }) => Promise<WWebJSMessage[]>;
};

async function fetchGroupHeader(
  groupName: string
): Promise<GroupHeader> {
  const chats: WWebJSChat[] = await whatsappClient.getChats();
  const group = chats.find((chat): chat is Group => chat.isGroup && chat.name === groupName);
  if (group) {
    return {
      name: group.name,
    };
  }
  throw new Error('Group not found');
}

async function fetchGroupMessages(
  groupName: string
): Promise<Message[]> {
  const chats: WWebJSChat[] = await whatsappClient.getChats();
  const group = chats.find((chat): chat is Group => chat.isGroup && chat.name === groupName);
  if (group) {
    const messages = (await group.fetchMessages({ limit: 10000 })) as Message[];
    console.log(`Total messages fetched: ${messages.length}`);
    return messages;
  }
  throw new Error('Group not found');
}

async function sendGroupMessage(
  groupName: string,
   message: string
  ): Promise<void> {
  const chats: WWebJSChat[] = await whatsappClient.getChats();
  const group = chats.find((chat): chat is Group => chat.isGroup && chat.name === groupName);
  if (group) {
    await group.sendMessage(message);
  } else {
    throw new Error('Group not found');
  }
}

async function fetchGroupImagesFromCache(
): Promise<string[]> {
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  const imageFiles = fs.readdirSync(imageDir).filter((file) => {
    const filePath = path.join(imageDir, file);
    const stats = fs.statSync(filePath);
    return stats.mtime.getTime() >= oneWeekAgo;
  });
  const imageUrls = imageFiles.map((file) => `/images/${file}`);
  return imageUrls;
}

export { 
  fetchGroupHeader,
  fetchGroupMessages, 
  sendGroupMessage,
  fetchGroupImagesFromCache 
};
