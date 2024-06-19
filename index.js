import puppeteer from 'puppeteer';
import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import fs from 'fs';
import OpenAI from 'openai';
import vision from '@google-cloud/vision';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const { Client, LocalAuth, MessageMedia } = pkg;
const app = express();
const port = process.env.PORT || 3000;

// Initialize OpenAI API
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Initialize Google Cloud Vision API
const visionClient = new vision.ImageAnnotatorClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

// In-memory storage for chat history
const chatHistory = {};

// Initialize WhatsApp client with Puppeteer options
const whatsappClient = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-gpu'],
    },
    webVersionCache: { type: 'remote', remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html' }
});

whatsappClient.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

whatsappClient.on('ready', () => {
    console.log('WhatsApp client is ready!');
    listenToGroup(process.env.GROUP_NAME);
});

whatsappClient.on('message', async (message) => {
    try {
        const chat = await message.getChat();
        if (chat.isGroup && chat.name === process.env.GROUP_NAME) {
            console.log(`Received message in group: ${chat.name}`);
            await handleGroupMessage(chat, message);
        }
    } catch (error) {
        console.error('Error processing message:', error);
    }
});

async function handleGroupMessage(chat, message) {
    if (!chatHistory[chat.id._serialized]) {
        chatHistory[chat.id._serialized] = [];
    }

    const contact = await message.getContact();
    const sender = `${contact.pushname || contact.number}`;

    let text;
    if (message.type === 'ptt') {
        const media = await message.downloadMedia();
        text = await transcribeVoiceMessage(media);
    } else {
        text = message.body;
    }

    chatHistory[chat.id._serialized].push({
        role: 'user',
        content: `${sender}: ${text}`
    });

    await processGroupMessages(chat);
}

async function processGroupMessages(chat) {
    try {
        const messages = await chat.fetchMessages({ limit: 10000 });
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

        const recentMessages = await Promise.all(messages.filter(msg => {
            const msgDate = msg.timestamp * 1000;  // convert from seconds to milliseconds
            return msgDate >= oneWeekAgo;
        }).map(async msg => {
            const sender = msg.author || msg.from; // Use author if available, otherwise from
            const contact = await msg.getContact();
            const media = msg.hasMedia ? await msg.downloadMedia() : null;

            let text;
            if (msg.type === 'ptt') {
                text = await transcribeVoiceMessage(media);
            } else {
                text = msg.body;
            }

            return {
                text,
                timestamp: msg.timestamp * 1000, // convert from seconds to milliseconds
                sender: `${contact.pushname || contact.number}`,
                type: msg.type,
                media
            };
        }));

        console.log(`Fetched recent messages: ${recentMessages.length}`);

        // Sort messages chronologically
        recentMessages.sort((a, b) => a.timestamp - b.timestamp);

        // Process text messages
        const textMessages = recentMessages.filter(msg => msg.type === 'chat' || msg.type === 'ptt').map(msg => msg.text);

        // Process image messages
        const imageMessages = recentMessages.filter(msg => msg.media && msg.type === 'image');

        const imageDescriptions = await Promise.all(imageMessages.map(async (msg) => {
            const description = await describeImage(msg.media.data);
            return `${msg.sender}: ${description}`;
        }));

        const summary = await generateSummary(textMessages, imageDescriptions, recentMessages);
        console.log(`Generated Summary:\n${summary}`);

        // Send the summary to the group chat (or any other desired action)
        await chat.sendMessage(`סיכום שבועי:\n${summary}`);
    } catch (error) {
        console.error('Error processing group messages:', error);
    }
}

async function generateSummary(textMessages, imageDescriptions, messages) {
    const combinedContent = await Promise.all(messages.map(async (msg) => {
        if (msg.type === 'chat' || msg.type === 'ptt') {
            return `${msg.sender} (${new Date(msg.timestamp).toLocaleString()}): ${msg.text}`;
        } else if (msg.media && msg.type === 'image') {
            const description = await describeImage(msg.media.data);
            return `${msg.sender} (${new Date(msg.timestamp).toLocaleString()}): ${description}`;
        }
    }));

    const response = await openai.completions.create({
        model: "text-davinci-003",
        prompt: `סכם את ההודעות הבאות לניוזלטר שבועי:\n${combinedContent.join("\n\n")}`,
        max_tokens: 1024,
    });
    return response.choices[0].text.trim();
}

async function describeImage(base64Image) {
    const request = {
        image: {
            content: base64Image,
        },
    };
    const [result] = await visionClient.labelDetection(request);
    const descriptions = result.labelAnnotations.map(label => label.description);
    return descriptions.join(', ');
}

async function transcribeVoiceMessage(media) {
    // Implement the transcription logic here, you may use a service like Google Cloud Speech-to-Text
    // For now, we'll return a placeholder
    return "Transcribed voice message text.";
}

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

// Express routes
app.get('/generate-newsletter', async (req, res) => {
    try {
        const chats = await whatsappClient.getChats();
        const group = chats.find(chat => chat.isGroup && chat.name === process.env.GROUP_NAME);
        if (group) {
            await processGroupMessages(group);
            res.status(200).send('Newsletter generated successfully.');
        } else {
            res.status(404).send('Group not found.');
        }
    } catch (error) {
        console.error('Error generating newsletter:', error);
        res.status(500).send('Error generating newsletter.');
    }
});

app.get('/send-newsletter', async (req, res) => {
    try {
        const chats = await whatsappClient.getChats();
        const group = chats.find(chat => chat.isGroup && chat.name === process.env.GROUP_NAME);
        if (group) {
            const summary = await generateSummary([], [], []); // Replace with actual message processing
            await group.sendMessage(`סיכום שבועי:\n${summary}`);
            res.status(200).send('Newsletter sent successfully.');
        } else {
            res.status(404).send('Group not found.');
        }
    } catch (error) {
        console.error('Error sending newsletter:', error);
        res.status(500).send('Error sending newsletter.');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
