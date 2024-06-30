# Use the official lightweight Node.js image
FROM node:18-slim

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# RUN sed -i "s/\('MediaPrep'\)/'prepRawMedia'/" ./node_modules/whatsapp-web.js/src/util/Injected.js
# RUN sed -i "s/window.Store.DownloadManager.downloadAndDecrypt/\(window.Store.DownloadManager.downloadAndMaybeDecrypt || window.Store.DownloadManager.downloadAndDecrypt\)/" ./node_modules/whatsapp-web.js/src/structures/Message.js

# Install Puppeteer dependencies
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libgbm-dev \
    chromium \
    && rm -rf /var/lib/apt/lists/*

COPY . .

RUN mkdir public
RUN mkdir public/images
RUN npm run build

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

EXPOSE 3000

CMD ["node", "dist/server.js"]