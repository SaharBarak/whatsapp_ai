import express from 'express';
import whatsappClient from '../services/whatsappService.js';

const router = express.Router();

router.get('/send-newsletter', async (req, res) => {
    try {
        const groupName = process.env.GROUP_NAME;
        const group = whatsappClient.getChats().then(chats => chats.find(chat => chat.isGroup && chat.name === groupName));
        if (group) {
            // Fetch the latest generated newsletter (implement this logic based on how you store it)
            const latestNewsletter = 'Latest newsletter content'; // Placeholder
            await group.sendMessage(latestNewsletter);
            res.status(200).send('Newsletter sent successfully');
        } else {
            res.status(404).send('Group not found');
        }
    } catch (error) {
        res.status(500).send('Error sending newsletter');
    }
});

export default router;
