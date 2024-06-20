import app from './app.js';
import whatsappClient from './services/whatsappService.js';
import { config } from './config/config.js';

const PORT = config.port;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    whatsappClient.initialize();
});
