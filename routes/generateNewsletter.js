import express from 'express';
import { processMessages } from '../services/newsletterGenerator.js';
import whatsappClient from '../services/whatsappService.js';

const router = express.Router();

router.get('/generate-newsletter', async (req, res) => {
    try {
        const groupName = process.env.GROUP_NAME;
        const prompt = req.query.prompt || 'Summarize the following messages into a weekly newsletter:';
        const chats = await whatsappClient.getChats();
        const group = chats.find(chat => chat.isGroup && chat.name === groupName);

        if (group) {
            const messages = await group.fetchMessages({ limit: 10000 });
            console.log(messages);
            const result = await processMessages(messages, prompt);
            res.status(200).json(result);
        } else {
            res.status(404).send('Group not found');
        }
    } catch (error) {
        console.error('Error generating newsletter:', error);
        res.status(500).send(`Error generating newsletter: ${error.message}`);
    }
});

export default router;
