import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { findOne, insertOne } from '../clients/mongoClient.js';

const { Client, LocalAuth } = pkg;

const sessionDir = './src/clients/session_data';

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

export default whatsappClient;
