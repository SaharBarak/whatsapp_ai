import express from 'express';
import { processMessages } from '../services/newsletterGenerator.js';
import whatsappClient from '../services/whatsappService.js';

const router = express.Router();

router.post('/generate-newsletter', async (req, res) => {
    const { prompt } = req.body; // Get the custom prompt from the request body

    try {
        const groupName = process.env.GROUP_NAME;
        const group = await whatsappClient.getChats().then(chats => chats.find(chat => chat.isGroup && chat.name === groupName));
        if (group) {
            const messages = await group.fetchMessages({ limit: 10000 });
            console.log(messages);
            await processMessages(messages, prompt);
            res.status(200).send('Newsletter generated successfully');
        } else {
            res.status(404).send('Group not found');
        }
    } catch (error) {
        res.status(500).send('Error generating newsletter');
    }
});

export default router;
