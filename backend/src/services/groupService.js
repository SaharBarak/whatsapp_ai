import whatsappClient from '../clients/whatsappClient.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageDir = path.join(__dirname, '../public/images');


async function fetchGroupHeader(groupName) {
    const chats = await whatsappClient.getChats();
    const group = chats.find(chat => chat.isGroup && chat.name === groupName);

    if (group) {
        return {
            name: group.name,
            // No image retrieval here
        };
    } else {
        throw new Error('Group not found');
    }
}

async function fetchGroupMessages(groupName) {
    const chats = await whatsappClient.getChats();
    const group = chats.find(chat => chat.isGroup && chat.name === groupName);
    
    if (group) {
        const messages = await group.fetchMessages({ limit: 10000 });
        console.log(`Total messages fetched: ${messages.length}`);
        return messages;
    } else {
        throw new Error('Group not found');
    }
}

async function sendGroupMessage(groupName, message) {
    const chats = await whatsappClient.getChats();
    const group = chats.find(chat => chat.isGroup && chat.name === groupName);

    if (group) {
        await group.sendMessage(message);
    } else {
        throw new Error('Group not found');
    }
}

async function fetchGroupImagesFromCache(groupName) {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

    const imageFiles = fs.readdirSync(imageDir).filter(file => {
      const filePath = path.join(imageDir, file);
      const stats = fs.statSync(filePath);
      return stats.mtime.getTime() >= oneWeekAgo;
    });
  
    const imageUrls = imageFiles.map(file => `/images/${file}`);
    return imageUrls;
}

export { fetchGroupHeader, fetchGroupMessages, sendGroupMessage, fetchGroupImagesFromCache };

// async function fetchGroupImages(groupName) {
//     const messages = await fetchGroupMessages(groupName);
//     const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

//     const imageMessages = messages.filter(msg => msg.hasMedia && msg.type === 'image' && msg.timestamp * 1000 >= oneWeekAgo);

//     const imageUrls = await Promise.all(imageMessages.map(async (msg) => {
//         const media = await msg.downloadMedia();
//         return media.url;
//     }));

//     return imageUrls;
// }

