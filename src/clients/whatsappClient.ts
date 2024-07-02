import config from '../config/config.js';
import pkg, { Message } from 'whatsapp-web.js';

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

export default whatsappClient;
