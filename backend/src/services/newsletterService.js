import { fetchGroupMessages } from './groupService.js';
import { generateSummary } from '../gateways/openaiGateway.js';
import { processImageDescriptions } from './visionService.js';
import { writeMessagesToCache } from './cacheService.js';

const CHUNK_SIZE = 1000; // Define a reasonable chunk size for API requests

function simplifyMessageForLog(message) {
    const { body, timestamp, from, to, author, type, hasMedia } = message;
    return { body, timestamp, from, to, author, type, hasMedia };
}

function simplifyMessageForAPI(message) {
    const { body, timestamp, sender, type, date } = message;
    return { body, timestamp, sender, type, date };
}

async function fetchAndProcessMessages(groupName) {
    const messages = await fetchGroupMessages(groupName);
    console.log(messages.length);
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

    console.log(`One week ago: ${new Date(oneWeekAgo).toLocaleString()}`);

    const recentMessages = await Promise.all(messages.map(async msg => {
        const msgDate = new Date(msg.timestamp * 1000).toLocaleString();
        console.log(`Message timestamp: ${msgDate}, One week ago: ${new Date(oneWeekAgo).toLocaleString()}`);
        if (msg.timestamp * 1000 >= oneWeekAgo) {
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
            console.log(`Simplified Message: ${JSON.stringify(simplifiedMessage)}`);
            return simplifiedMessage;
        } else {
            console.log(`Message skipped: ${msgDate}`);
            return null;
        }
    }));

    const filteredMessages = recentMessages.filter(msg => msg !== null);
    console.log(`Recent messages count: ${filteredMessages.length}`);
    return filteredMessages;
}

async function chunkArray(array, size) {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += size) {
        chunkedArray.push(array.slice(i, i + size));
    }
    return chunkedArray;
}

export async function generateNewsletterText(groupName, prompt) {
    const recentMessages = await fetchAndProcessMessages(groupName);
    const imageDescriptions = await processImageDescriptions(recentMessages);

    // Combine text messages and image descriptions
    const combinedMessages = [
        ...recentMessages.filter(msg => msg.type === 'chat'),
        ...imageDescriptions
    ];

    // Sort messages chronologically
    combinedMessages.sort((a, b) => a.timestamp - b.timestamp);

    // Simplify messages for logging
    const simplifiedMessagesForLog = combinedMessages.map(msg => simplifyMessageForLog(msg));

    // Write messages to cache
    writeMessagesToCache(simplifiedMessagesForLog);

    // Simplify messages for API
    const simplifiedMessagesForAPI = combinedMessages.map(msg => simplifyMessageForAPI(msg));

    // // Chunk messages for API requests
    // const messageChunks = await chunkArray(simplifiedMessagesForAPI, CHUNK_SIZE);

    // // Generate summaries for each chunk
    // const chunkSummaries = await Promise.all(messageChunks.map(async (chunk, index) => {
    //     console.log(`Processing chunk ${index + 1}/${messageChunks.length}`);
    //     return await generateSummary(chunk, prompt);
    // }));

    // Combine chunk summaries into a final summary
    const finalSummary = simplifiedMessagesForAPI;//chunkSummaries.join('\n\n');

    return finalSummary;
}
