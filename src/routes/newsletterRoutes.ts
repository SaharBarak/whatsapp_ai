import express, { Request, Response } from 'express';
import { generateNewsletterObject, generateNewsletterText } from '../services/newsletterService.js';
import { sendGroupMessage } from '../services/groupService.js';
import config from '../config/config.js';

const router = express.Router();

// Route to generate the newsletter object
router.post('/generate-newsletter', async (req: Request, res: Response) => {
  const { prompt } = req.body;

  try {
    const groupName = config.groupName;
    const newsletterText = await generateNewsletterObject(groupName, prompt);
    res.status(200).send(newsletterText);
  } catch (error) {
    res.status(500).send(`Error generating newsletter: ${(error as Error).message}`);
  }
});

// Route to send the newsletter
router.get('/send-newsletter', async (req: Request, res: Response) => {
  try {
    const groupName = config.groupName;
    const latestNewsletter = 'Latest newsletter content'; // Placeholder
    await sendGroupMessage(groupName, latestNewsletter);
    res.status(200).send('Newsletter sent successfully');
  } catch (error) {
    res.status(500).send(`Error sending newsletter: ${(error as Error).message}`);
  }
});

// Route to generate the newsletter text for Whatsapp Message
router.post('/text-newsletter', async (req: Request, res: Response) => {
  try {
    const groupName = config.groupName;
    const newsletterText = await generateNewsletterText(groupName, req.body.prompt);
    res.status(200).send(newsletterText);
    await sendGroupMessage(groupName, newsletterText);
  } catch (error) {
    res.status(500).send(`Error generating newsletter: ${(error as Error).message}`);
  }
});

export default router;
