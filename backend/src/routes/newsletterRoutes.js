import express from 'express';
import { generateNewsletterText } from '../services/newsletterService.js';
import { sendGroupMessage } from '../services/groupService.js';

const router = express.Router();

// Route to generate the newsletter text
router.post('/generate-newsletter', async (req, res) => {
    const { prompt } = req.body;

    try {
        const groupName = process.env.GROUP_NAME;
        const newsletterText = await generateNewsletterText(groupName, prompt);
        res.status(200).send(newsletterText);
    } catch (error) {
        res.status(500).send(`Error generating newsletter: ${error.message}`);
    }
});

// Route to send the newsletter
router.get('/send-newsletter', async (req, res) => {
    try {
        const groupName = process.env.GROUP_NAME;
        const latestNewsletter = 'Latest newsletter content'; // Placeholder
        await sendGroupMessage(groupName, latestNewsletter);
        res.status(200).send('Newsletter sent successfully');
    } catch (error) {
        res.status(500).send(`Error sending newsletter: ${error.message}`);
    }
});

export default router;
