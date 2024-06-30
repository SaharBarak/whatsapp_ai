import { ImageAnnotatorClient } from '@google-cloud/vision';
import config from '../config/config.js';

const visionClient = new ImageAnnotatorClient({
  keyFilename: config.googleCredentials,
});

export async function describeImage(base64Image: string): Promise<string> {
  const request = {
    image: {
      content: base64Image,
    },
  };
  const [result] = await visionClient.labelDetection(request);
  const descriptions = result.labelAnnotations?.map((label) => label.description) || [];
  return descriptions.join(', ');
}
