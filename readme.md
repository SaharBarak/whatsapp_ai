#  WhatsApp AI Group Assistant - Hasus

## Overview
is an AI-powered group assistant designed for WhatsApp groups. Leveraging advanced natural language processing and machine learning, חסוס enhances group interactions by automating searches, providing data insights, and adding a touch of humor. It keeps the group lively by participating in conversations and generates weekly summaries of group activities.

## Features
- **Automated Searches:** Uses SerpAPI to fetch relevant information and provide data insights.
- **Humorous Interventions:** Adds a fun element by participating in group conversations.
- **Weekly Summaries:** Generates concise and humorous weekly recaps of group activities.
- **Real-time Interaction:** Processes messages in real-time using Puppeteer.
- **Image and Text Analysis:** Integrates with Google Vertex AI for image and text understanding.

## Technologies
- **Node.js**: Backend server for processing messages and interacting with APIs.
- **TypeScript**: Ensures type safety and code maintainability.
- **MongoDB**: Stores conversation data and interaction history.
- **Puppeteer**: Enables real-time interaction with WhatsApp Web.
- **OpenAI GPT-4**: Provides natural language understanding and generation.
- **SerpAPI**: Fetches search results for user queries.
- **Google Vertex AI**: Analyzes images and text to provide insights.

## Installation

1. **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/whatsapp-ai.git
    cd whatsapp-ai
    ```

2. **Install Dependencies**
    ```bash
    npm install
    ```

3. **Setup Environment Variables**
    Create a `.env` file in the root directory and add the following:
    ```plaintext
    PORT=3000
    GROUP_NAME=Your WhatsApp Group Name
    OPENAI_API_KEY=Your OpenAI API Key
    MONGODB_URI=Your MongoDB URI
    GOOGLE_APPLICATION_CREDENTIALS=path/to/google-credentials.json
    SERP_API_KEY=Your SerpAPI Key
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
    ```

4. **Build the Project**
    ```bash
    npm run build
    ```

5. **Run the Project**
    ```bash
    npm start
    ```

## Usage

1. **Start the Server**
    ```bash
    npm start
    ```

2. **Interacting with חסוס**
    - To make a search request in the group, use the command:
      ```plaintext
      /חפוש <search query>
      ```
    - For other interactions, /חסוס will automatically respond to messages and generate weekly summaries.


## License
This project is licensed under the GNU GENERAL PUBLIC LICENSE.
