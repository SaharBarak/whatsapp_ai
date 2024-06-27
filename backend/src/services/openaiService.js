import db from '../clients/mongoClient.js';
import { hasusCommand } from "../gateways/openAIGateway.js"
import { sendGroupMessage } from "./groupService.js"
import config from '../config/config.js';

export async function handleHasusCommand(msg){
    const contact = await msg.getContact() || null;
    const senderName = contact.name || contact.pushname || contact.number || "סהר";
    try {
        const prompt = msg.body.replace('/חסוס ', '');//`חסוס, תצטרף לשיחה על סמך ההודעות הבאות:
        // Fetch the last 100 messages
        const messages = await db.find('messages', { groupName: msg.from }, { sort: { timestamp: -1 }, limit: 100 });
        const last100Messages = messages.reverse().map(m => ({
            body: m.body,
            sender: m.sender,
            date: new Date(m.timestamp * 1000).toLocaleString('he-IL')
        }));

        // Generate a response using OpenAI
        const formattedMessages = last100Messages.map(m => `${m.date} - ${m.sender}: ${m.body}`).join('\n');
        const response = await hasusCommand(formattedMessages, prompt, senderName);

        // Send the response to the group
        await sendGroupMessage(config.groupName, response);
        console.log(`Hasus replied: ${response}`);
    } catch (error) {
        console.error('Error handling /hasus command:', error);
    }
}