import express from 'express';
import dotenv from 'dotenv';
import whatsappClient from './src/clients/whatsappClient.js';
import { config } from './src/config/config.js';
import newsletterRoutes from './src/routes/newsletterRoutes.js';
import './src/handlers/eventHandlers.js'; // Ensure event handlers are initialized
import { connectDb } from './database/mongoClient.js';


dotenv.config();
const app = express();

app.use(express.json());

// Use the consolidated newsletter routes
app.use('/api/newsletter', newsletterRoutes);

const PORT = config.port || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDb();
    whatsappClient.initialize();
});

export default app;
