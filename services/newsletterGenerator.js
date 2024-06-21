import { generateSummary } from './openaiService.js';
import { describeImage } from './vertexaiService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ensureCacheDirExists from './helpers/ensureCacheDirExists.js';
import whatsappClient from './whatsappService.js'; // Ensure to import the WhatsApp client

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function simplifyMessageForLog(message) {
    const { body, timestamp, from, to, author, type, hasMedia } = message;
    return { body, timestamp, from, to, author, type, hasMedia };
}

function simplifyMessageForAPI(message) {
    const { body, timestamp, sender, type, date } = message;
    return { body, timestamp, sender, type, date };
}

export async function processMessages(messages, prompt) {
    try {
        console.log('Starting to process messages');
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

        const recentMessages = await Promise.all(messages.filter(msg => msg.timestamp * 1000 >= oneWeekAgo).map(async msg => {
            const contact = await msg.getContact();
            const senderName = contact.pushname || contact.number;
            const simplifiedMessage = {
                senderName,
                body: msg.body,
                timestamp: msg.timestamp * 1000,
                sender: `${contact.pushname || contact.number}`,
                type: msg.type,
                hasMedia: msg.hasMedia,
                date: new Date(msg.timestamp * 1000).toLocaleString('he-IL') // Use Hebrew locale
            };
            console.log('Processed message:', simplifyMessageForLog(simplifiedMessage));
            return simplifiedMessage;
        }));

        console.log(`Filtered to ${recentMessages.length} recent messages`);

        const imageMessages = recentMessages.filter(msg => msg.hasMedia);

        console.log(`Processing ${imageMessages.length} image messages`);

        const imageDescriptions = await Promise.all(imageMessages.map(async (msg) => {
            const media = await msg.downloadMedia();
            const description = await describeImage(media.data);
            return {
                ...msg,
                body: `${msg.body}\n\nתיאור: ${description}`
            };
        }));

        // Combine text messages and image descriptions
        const combinedMessages = [
            ...recentMessages.filter(msg => msg.type === 'chat'),
            ...imageDescriptions
        ];

        // Sort messages chronologically
        combinedMessages.sort((a, b) => a.timestamp - b.timestamp);

        // Ensure the cache directory exists
        ensureCacheDirExists();

        // Generate a timestamp for the filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const cacheFilePath = path.join(__dirname, `../../cache/messages_${timestamp}.json`);
        console.log(`Writing messages to: ${cacheFilePath}`);
        
        // Save the simplified messages without media data
        const simplifiedMessagesForFile = combinedMessages.map(msg => simplifyMessageForLog(msg));
        fs.writeFileSync(cacheFilePath, JSON.stringify(simplifiedMessagesForFile, null, 2));

        // Prepare the structured JSON for API request
        const structuredJSONForAPI = combinedMessages.map(msg => simplifyMessageForAPI(msg));

        // const summary = await generateSummary(structuredJSONForAPI, prompt);
        // console.log(`Generated Summary:\n${summary}`);

        // // Assuming you have access to the chat object to send the message
        // const chat = await whatsappClient.getChatById(messages[0].from); // or any valid method to get the chat
        // chat.sendMessage(`סיכום שבועי:\n${summary}`);

        // Return the combined messages for the response
        return simplifiedMessagesForFile;
    } catch (error) {
        console.error('Error processing messages:', error);
        throw error;
    }
}
