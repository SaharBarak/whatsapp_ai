import { describeImage } from '../gateways/vertexGateway.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imageDir = path.join(__dirname, '../../../public/images');

async function processImageDescriptions(recentMessages) {
    const imageMessages = recentMessages.filter(msg => msg.hasMedia && msg.type === 'image');

    const imageDescriptions = await Promise.all(imageMessages.map(async (msg) => {
        const imagePath = path.join(imageDir, `${msg.timestamp}.jpg`);
        
        if (fs.existsSync(imagePath)) {
            try {
                const imageData = fs.readFileSync(imagePath, 'base64');
                const description = await describeImage(imageData);
                return {
                    ...msg,
                    body: `${msg.body}\n\nתיאור: ${description}`
                };
            } catch (error) {
                console.error('Error processing image:', error);
                return msg; // Return the original message if image processing fails
            }
        } else {
            console.warn(`Image not found: ${imagePath}`);
            return msg; // Return the original message if image file is not found
        }
    }));

    return imageDescriptions;
}

export { processImageDescriptions };
