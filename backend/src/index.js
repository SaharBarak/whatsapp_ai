import express from 'express';
import dotenv from 'dotenv';
import whatsappClient from './clients/whatsappClient.js';
import config from './config/config.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import './handlers/eventHandlers.js'; // Ensure event handlers are initialized
import db from './clients/mongoClient.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory to store secrets
const SECRET_DIR = '/app/secrets';

// Function to read secret from a file
const readSecret = (secretName) => {
  try {
    const secretPath = path.join(SECRET_DIR, secretName);
    return fs.readFileSync(secretPath, 'utf8').trim();
  } catch (err) {
    console.error(`Error reading secret ${secretName}:`, err);
    return null;
  }
};

// Load secrets
const openaiApiKey = readSecret('OPENAI_API_KEY') || process.env.OPENAI_API_KEY;
const googleCredentials = readSecret('GOOGLE_CREDENTIALS_JSON') || process.env.GOOGLE_APPLICATION_CREDENTIALS;
const mongoUri = readSecret('MONGODB_URI') || process.env.MONGODB_URI;
const groupName = readSecret('GROUP_NAME') || process.env.GROUP_NAME;

// Validate secrets
if (!openaiApiKey || !googleCredentials || !mongoUri || !groupName) {
  console.error('Missing required secrets. Ensure all secrets are provided.');
  process.exit(1);
}

// Save secrets to environment variables
process.env.OPENAI_API_KEY = openaiApiKey;
process.env.GOOGLE_APPLICATION_CREDENTIALS = googleCredentials;
process.env.MONGODB_URI = mongoUri;
process.env.GROUP_NAME = groupName;

const app = express();

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use('/api/newsletter', newsletterRoutes);

const PORT = config.port || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    db.connectDb();
    whatsappClient.initialize();
});

export default app;
