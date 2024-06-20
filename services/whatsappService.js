import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { config } from '../config/config.js';

const { Client, LocalAuth } = pkg;

const sessionDir = './session_data';

const whatsappClient = new Client({
    authStrategy: new LocalAuth({
        clientId: "client-one", // Unique ID for the client, change as needed
        dataPath: sessionDir // Path where session data is stored
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-gpu'],
        executablePath: '/usr/local/bin/chromium',
    },
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
    }
});

whatsappClient.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

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

export default whatsappClient;
