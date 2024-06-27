import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: process.env.PORT || 3000,
    groupName: process.env.GROUP_NAME,
    openaiApiKey: process.env.OPENAI_API_KEY,
    googleCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    mongoPath: process.env.MONGODB_URI,
    puppeteer: process.env.PUPPETEER_EXECUTABLE_PATH
};

export default config;
