import express, { Request, Response, NextFunction } from 'express';
import whatsappClient from './clients/whatsappClient';
import config from './config/config';
import newsletterRoutes from './routes/newsletterRoutes';
import db from './clients/mongoClient';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/api/newsletter', newsletterRoutes);
const PORT = config.port || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    db.connectDb();
    whatsappClient.initialize();
  } catch (error) {
    console.log(error);
  }
});

export default app;
