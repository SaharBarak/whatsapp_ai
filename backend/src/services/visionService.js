import { describeImage } from '../gateways/vertexGateway.js';

async function processImageDescriptions(recentMessages) {
    const imageMessages = recentMessages.filter(msg => msg.hasMedia && msg.type === 'image');

    const imageDescriptions = await Promise.all(imageMessages.map(async (msg) => {
        const media = await msg.downloadMedia();
        const description = await describeImage(media.data);
        return {
            ...msg,
            body: `${msg.body}\n\nתיאור: ${description}`
        };
    }));

    return imageDescriptions;
}

async function generateVisualsForText(summaries) {
    const summariesWithVisuals = await Promise.all(summaries.map(async (summary) => {
        const visualUrl = await generateVisuals(summary);
        return {
            text: summary,
            visualUrl
        };
    }));

    return summariesWithVisuals;
}

export { processImageDescriptions, generateVisualsForText };
