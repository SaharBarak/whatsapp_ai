import vision from '@google-cloud/vision';
import { config } from '../config/config.js';

const visionClient = new vision.ImageAnnotatorClient({
    keyFilename: config.googleCredentials,
});

export async function describeImage(base64Image) {
    const request = {
        image: {
            content: base64Image,
        },
    };
    const [result] = await visionClient.labelDetection(request);
    const descriptions = result.labelAnnotations.map(label => label.description);
    return descriptions.join(', ');
}
