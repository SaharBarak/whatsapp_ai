import whatsappClient from '../clients/whatsappClient.js';
import config from '../config/config.js';
import { handleHasusCommand } from '../services/openaiService.js';
import { handleMessage, handleOutgoingMessage } from './messageHandlers.js';

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

whatsappClient.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log(qr);
});

whatsappClient.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

whatsappClient.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
});

whatsappClient.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});


whatsappClient.on('message', async (msg) => {
    await handleMessage(msg);
});

whatsappClient.on('message_create', async (msg) => {
    if(msg.body.startsWith('/חסוס ')){
        await handleHasusCommand(msg);
    } else {
        if (msg.fromMe) {
            await handleOutgoingMessage(msg);
        }
    }
});