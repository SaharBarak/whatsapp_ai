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

dotenv.config();
const app = express();

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use('/api/newsletter', newsletterRoutes);

const PORT = config.port || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    db.connectDb();
    whatsappClient.initialize();
    console.log("whatsapp should have intiated");
});

export default app;
