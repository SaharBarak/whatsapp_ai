import whatsappClient from '../clients/whatsappClient.js';
import config from '../config/config.js';
import db from '../clients/mongoClient.js'

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
});

whatsappClient.on('message', async (msg) => {
    try {
        const chat = await msg.getChat();
        if (chat.isGroup && chat.name === config.groupName) {
            const contact = await msg.getContact();
            const senderName = contact.pushname || contact.number;
            console.log(`${senderName} has commented`);

            const message = {
                groupName: msg.from,
                body: msg.body,
                timestamp: msg.timestamp,
                sender: contact.pushname || contact.number,
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
});