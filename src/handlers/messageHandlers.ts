import { insertOne, findOne } from '../clients/mongoClient';
import { describeImage } from '../gateways/vertexGateway';
import config from '../config/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Message, Contact, Chat } from 'whatsapp-web.js';
import { RecentGroupMessage } from '../types/RecentGroupMessage';
import { fromGroupMessage } from '../types/predicates/fromGroupMessage';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imageDir = path.join(__dirname, '../../../public/images');

// Ensure the directory exists
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

export async function handleMessage(
  msg: Message
) {
  try {
    const chat: Chat = await msg.getChat();
    if (chat.isGroup && chat.name === config.groupName) {
      const contact: Contact = await msg.getContact();
      const senderName: string = contact.name || contact.pushname || contact.number;
      console.log(`${senderName} has commented`);

      if (msg.type === 'chat') {
        await handleTextMessage(msg, senderName);
      } else if (msg.type === 'image' && msg.hasMedia) {
        await handleImageMessage(msg, senderName);
      }
    }
  } catch (error) {
    console.error('Error handling message:', error);
  }
}

export async function handleOutgoingMessage(
  msg: Message
) {
  try {
    const chat: Chat = await msg.getChat();
    if (chat.isGroup && chat.name === config.groupName) {
      console.log('You have commented');

      const senderName = 'סהר ברק';

      if (msg.type === 'chat') {
        await handleTextMessage(msg, senderName);
      } else if (msg.type === 'image' && msg.hasMedia) {
        await handleImageMessage(msg, senderName);
      }
    }
  } catch (error) {
    console.error('Error handling message:', error);
  }
}

export async function handleTextMessage(
  msg: Message,
   senderName: string
  ) {
  const message = {
    groupName: msg.from,
    body: msg.body,
    timestamp: msg.timestamp,
    sender: senderName,
    type: msg.type,
    hasMedia: msg.hasMedia ? 1 : 0,
    date: new Date(msg.timestamp * 1000).toISOString(),
  };

  // Check if the message already exists in the database
  const existingMessage = await findOne('messages', {
    groupName: message.groupName,
    body: message.body,
    sender: message.sender,
    timestamp: message.timestamp,
  });

  // Only add the message if it doesn't already exist
  if (!existingMessage) {
    await insertOne('messages', message);
    console.log(`Text message by ${senderName} saved.`);
  } else {
    console.log('Text message already exists in the database');
  }
}

export async function handleImageMessage(
  msg: Message,
   senderName: string
  ) {
  const message: RecentGroupMessage = fromGroupMessage(msg, senderName);

  // Check if the message already exists in the database
  const existingMessage = await findOne('messages', {
    groupName: message.groupName,
    body: message.body,
    sender: message.senderName,
    timestamp: message.timestamp,
  });

  // Only add the message if it doesn't already exist
  if (!existingMessage) {
    try {
      const media = await msg.downloadMedia();
      const imagePath = path.join(imageDir, `${msg.timestamp}.jpg`);
      fs.writeFileSync(imagePath, media.data, 'base64');
      console.log('Image saved:', imagePath);

      // Process image description
      const description = await describeImage(media.data);
      message.description = description;
      console.log('Image description processed:', description);

      await insertOne('messages', message);
      console.log(`Image message by ${senderName} saved.`);
    } catch (error) {
      console.error('Error downloading or processing media:', error);
    }
  } else {
    console.log('Image message already exists in the database');
  }
}
