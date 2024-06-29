# Use the official lightweight Node.js image
FROM node:18-slim

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

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

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Copy the setup script
COPY /app/setup.sh /app/setup.sh

# Ensure the setup script is executable
RUN chmod +x /app/setup.sh


ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Command to run the application
CMD ["/app/setup.sh", "&&", "node", "src/index.js"]

# Expose the port the app runs on
EXPOSE 3000
