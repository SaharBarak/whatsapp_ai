import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  groupName: string;
  openaiApiKey: string;
  googleCredentials: string;
  mongoPath: string;
  puppeteer: string;
  duckduckgiApiKey: string;
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  groupName: process.env.GROUP_NAME || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  googleCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS || '',
  mongoPath: process.env.MONGODB_URI || '',
  puppeteer: process.env.PUPPETEER_EXECUTABLE_PATH || '',
  duckduckgiApiKey: process.env.DUCKDUCKGO_API_KEY || '',
};

export default config;
