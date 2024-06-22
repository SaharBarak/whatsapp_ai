import whatsappClient from '../clients/whatsappClient.js';
import { config } from '../config/config.js';

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

whatsappClient.on('ready', () => {
    console.log('WhatsApp client is ready!');
    listenToGroup(config.groupName);
});

whatsappClient.on('message', async (message) => {
    try {
        const chat = await message.getChat();
        if (chat.isGroup && chat.name === config.groupName) {
            const contact = await message.getContact();
            const senderName = contact.pushname || contact.number;
            console.log(`${senderName} has commented`);
        }
    } catch (error) {
        console.error('Error handling message:', error);
    }
});
