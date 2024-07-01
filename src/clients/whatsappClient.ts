import config from '../config/config.js';
import { handleHasusCommand } from '../services/openaiService.js';
import { handleMessage, handleOutgoingMessage } from '../handlers/messageHandlers.js';
import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

const { Client, LocalAuth } = pkg;

const sessionDir = './src/clients/session_data';

const whatsappClient = new Client({
  authStrategy: new LocalAuth({
    clientId: 'client-two', // Unique ID for the client, change as needed
    dataPath: sessionDir, // Path where session data is stored
  }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
    executablePath: config.puppeteer,
  },
  webVersionCache: {
    type: 'remote',
    remotePath:
      'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
  },
});

whatsappClient.on('ready', () => {
  console.log('WhatsApp client is ready!');
  listenToGroup(config.groupName);
});

whatsappClient.on('qr', (qr: string) => {
  qrcode.generate(qr, { small: true });
  console.log(qr);
});

whatsappClient.on('message', async (msg: any) => {
  if (msg.body.startsWith('/חסוס ')) {
    await handleHasusCommand(msg);
  } else {
    await handleMessage(msg);
  }
});

whatsappClient.on('message_create', async (msg: any) => {
  if (msg.body.startsWith('/חסוס ') && msg.contact.isMe) {
    await handleHasusCommand(msg);
  } else {
    if (msg.fromMe) {
      await handleOutgoingMessage(msg);
    }
  }
});

async function listenToGroup(groupName: string) {
  console.log(`trying to connect ${groupName}`);
  const chats = await whatsappClient.getChats();
  const group = chats.find((chat) => chat.isGroup && chat.name === groupName);
  if (group) {
    console.log(`Listening to group: ${groupName}`);
  } else {
    console.error(`Group ${groupName} not found`);
  }
}

export default whatsappClient;
