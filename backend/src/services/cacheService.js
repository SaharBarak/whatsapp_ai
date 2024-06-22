import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function ensureCacheDirExists() {
    const cacheDir = path.join(__dirname, '../cache');
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir);
        console.log(`Cache directory created at ${cacheDir}`);
    } else {
        console.log(`Cache directory found at ${cacheDir}`);
    }
}

function generateCacheFilePath() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const cacheFilePath = path.join(__dirname, `../cache/messages_${timestamp}.json`);
    console.log(`Generated cache file path: ${cacheFilePath}`);
    return cacheFilePath;
}

function writeMessagesToCache(messages) {
    ensureCacheDirExists();
    const cacheFilePath = generateCacheFilePath();
    fs.writeFileSync(cacheFilePath, JSON.stringify(messages, null, 2));
    console.log(`Messages written to cache file: ${cacheFilePath}`);
    return cacheFilePath;
}

export { ensureCacheDirExists, generateCacheFilePath, writeMessagesToCache };
