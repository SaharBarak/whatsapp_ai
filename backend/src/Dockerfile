# Use the official lightweight Node.js image
FROM node:14-slim

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Copy the .env file
COPY .env .env

# Ensure the service account file is accessible
COPY path/to/your/service-account-file.json /path/to/your/service-account-file.json

# Command to run the application
CMD ["node", "index.js"]
