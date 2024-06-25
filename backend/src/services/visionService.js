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
        const imageData = fs.readFileSync(imagePath, 'base64');
        const description = await describeImage(imageData);
        return {
            ...msg,
            body: `${msg.body}\n\nתיאור: ${description}`
        };
    }));

    return imageDescriptions;
}

export { processImageDescriptions };
