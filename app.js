import express from 'express';
import generateNewsletterRoute from './routes/generateNewsletter.js';
import sendNewsletterRoute from './routes/sendNewsletter.js';
import { scheduleCronJobs } from './services/cronService.js';

const app = express();

app.use(express.json());

app.use('/', generateNewsletterRoute);
app.use('/', sendNewsletterRoute);

scheduleCronJobs();

export default app;
