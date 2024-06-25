import whatsappClient from '../clients/whatsappClient.js';
import config from '../config/config.js';
import db from '../clients/mongoClient.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imageDir = path.join(__dirname, '../../../public/images');

function listenToGroup(groupName) {
    whatsappClient.getChats().then(chats => {
        const group = chats.find(chat => chat.isGroup && chat.name === groupName);
        if (group) {
            console.log(`Listening to group: ${groupName}`);
        } else {
            console.error(`Group ${groupName} not found`);
        }
    });
}

async function handleMessage(msg){
    try {
        const chat = await msg.getChat();
        if (chat.isGroup && chat.name === config.groupName) {
            const contact = await msg.getContact();
            const senderName = contact.name;
            console.log(`${senderName} has commented`);

            const message = {
                groupName: msg.from,
                body: msg.body,
                timestamp: msg.timestamp,
                sender: contact.name,
                type: msg.type,
                hasMedia: msg.hasMedia ? 1 : 0,
                date: new Date(msg.timestamp * 1000).toISOString(),
            };
    
            // Check if the message already exists in the database
            const existingMessage = await db.findOne('messages', {
                groupName: message.groupName,
                body: message.body,
                sender: message.sender,
                timestamp: message.timestamp,
            });
    
            // Only add the message if it doesn't already exist
            if (!existingMessage) {
                await db.insertOne('messages', message);
            }
            console.log(`message by ${senderName} saved.`);

            // Save images locally
            if (msg.hasMedia && msg.type === 'image') {
                const media = await msg.downloadMedia();
                const imagePath = path.join(imageDir, `${msg.timestamp}.jpg`);
                fs.writeFileSync(imagePath, media.data, 'base64');
                console.log('Image saved:', imagePath);
            }
        }
    } catch (error) {
        console.error('Error handling message:', error);
    }
}

async function handleOutgoingMessage(msg) {
    try {
        const chat = await msg.getChat();
        if (chat.isGroup && chat.name === config.groupName) {
            console.log(`סהר have commented`);

            const message = {
                groupName: msg.to,
                body: msg.body,
                timestamp: msg.timestamp,
                sender: 'You',
                type: msg.type,
                hasMedia: msg.hasMedia ? 1 : 0,
                date: new Date(msg.timestamp * 1000).toISOString(),
            };

            // Check if the message already exists in the database
            const existingMessage = await db.findOne('messages', {
                groupName: message.groupName,
                body: message.body,
                sender: message.sender,
                timestamp: message.timestamp,
            });

            // Only add the message if it doesn't already exist
            if (!existingMessage) {
                await db.insertOne('messages', message);
            }
            console.log(`Message by סהר saved.`);

            // Save images locally
            if (msg.hasMedia && msg.type === 'image') {
                const media = await msg.downloadMedia();
                const imagePath = path.join(imageDir, `${msg.timestamp}.jpg`);
                fs.writeFileSync(imagePath, media.data, 'base64');
                console.log('Image saved:', imagePath);
            }
        }
    } catch (error) {
        console.error('Error handling message:', error);
    }
}

whatsappClient.on('ready', () => {
    console.log('WhatsApp client is ready!');
    listenToGroup(config.groupName);
});

whatsappClient.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

whatsappClient.on('message_create', async (msg) => {
    // Only handle the message if it is from the client itself
    if (msg.fromMe) {
      await handleOutgoingMessage(msg);
    }
});

whatsappClient.on('message', async (msg) => {
    await handleMessage(msg);
});