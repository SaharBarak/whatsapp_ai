# 🌟 WhatsApp Newsletter Bot 🌟

A WhatsApp bot that generates a weekly newsletter from group chat messages, including text, images, and voice messages. The bot leverages OpenAI's GPT-3 for generating summaries and Google Cloud APIs for image recognition and voice transcription.

## ✨ Features ✨

- **Weekly Newsletter Generation**: Collects group messages from the past week and generates a summary.
- **Voice Message Transcription**: Transcribes voice messages using Google Cloud Speech-to-Text.
- **Image Description**: Describes images using Google Cloud Vision.
- **Language Support**: Generates newsletters in Hebrew.
- **Endpoints**: Provides endpoints to generate and send the latest newsletter.
- **Automated Tasks**: Cron jobs for automatic newsletter generation and sending.
- **WhatsApp Session Persistence**: Maintains the WhatsApp session between reruns to avoid blocking due to too many reconnections.

## 📝 ToDo 📝

- **Dynamic Newsletter Styling**: Use GPT to understand context and build styling accordingly.
- **Process Voice Messages**: Implement the transcription logic using a service like Google Cloud Speech-to-Text.
- **Process Likes, Emojis, Links, and Social Media Posts**: Extend the message processing to include likes, emojis, links, and social media posts.
- **Migrate codebase to typescript**
- **Tighten flow regarding image descriptions**


## 🛠️ Prerequisites 🛠️

- Node.js (>=14.x)
- Docker
- Google Cloud Service Account with Vision and Speech-to-Text APIs enabled
- OpenAI API key
- WhatsApp Web session setup

## 📝 Environment Variables 📝

Create a `.env` file in the root directory with the following variables:

```plaintext
PORT=3000
GROUP_NAME=your-group-name
OPENAI_API_KEY=your-openai-api-key
GOOGLE_APPLICATION_CREDENTIALS=path-to-your-google-service-account.json
```

## 🚀 Installation 🚀

1. Clone the repository:

    ```bash
    git clone https://github.com/your-repo/whatsapp-newsletter-bot.git
    cd whatsapp-newsletter-bot
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file in the root directory with the following variables:

    ```plaintext
    PORT=3000
    GROUP_NAME=your-group-name
    OPENAI_API_KEY=your-openai-api-key
    GOOGLE_APPLICATION_CREDENTIALS=path-to-your-google-service-account.json
    MONGODB_URI=your_mongo_uri_with_creds
    ```

### Running the Bot

#### Using Node.js

1. Start the bot:

    ```bash
    npm start
    ```

2. Scan the QR code with your WhatsApp to authenticate.

#### Using Docker

1. Build the Docker image:

    ```bash
    docker build -t whatsapp-newsletter .
    ```

2. Run the Docker container:

    ```bash
    docker run --env-file .env -it --name whatsapp-newsletter-container whatsapp-newsletter
    ```

3. **Authenticate WhatsApp Web**:

    - After running the Docker container, the terminal will display a QR code.
    - Open WhatsApp on your phone and go to "Settings" > "Linked Devices".
    - Tap on "Link a Device" and scan the QR code displayed in the terminal.
    - Once authenticated, the bot will start interacting with WhatsApp.

4. **Reattach to the running container (if necessary)**:

    If you need to reattach to the container to view the QR code again, you can use the following command:
    ```bash
    docker attach whatsapp-newsletter-container
    ```

    Alternatively, you can access the terminal inside the container using:
    ```bash
    docker exec -it whatsapp-newsletter-container /bin/bash
    ```

## 📡 API Endpoints 📡

### Generate Newsletter

Generates the newsletter for the past week. Accepts a custom prompt from the request body.

**Endpoint**: `POST /generate-newsletter`

**Request Body**:
- `prompt` (optional): Custom prompt to use for generating the summary.

**Response**:
- `200 OK`: Newsletter generated successfully.
- `404 Not Found`: Group not found.
- `500 Internal Server Error`: Error generating newsletter.

**Example request:**

```json
{
    "prompt": "סכם את כל ההודעות והפעולות שבוצעו בקבוצה השבוע"
}
```

### Send Newsletter

Sends the latest generated newsletter to the WhatsApp group.

**Endpoint**: `GET /send-newsletter`

**Response**:
- `200 OK`: Newsletter sent successfully.
- `404 Not Found`: Group not found.
- `500 Internal Server Error`: Error sending newsletter.

## ⏱️ Cron Jobs ⏱️

Automate the generation and sending of the newsletter using cron jobs.

## 💰 Cost Considerations 💰

### OpenAI API

- The cost of using OpenAI's API depends on the number of tokens used in each request. Detailed pricing can be found on the [OpenAI pricing page](https://openai.com/pricing).

### Google Cloud APIs

- **Google Cloud Vision API**: Charges are based on the number of image annotations. See the [Google Cloud Vision pricing page](https://cloud.google.com/vision/pricing) for details.
- **Google Cloud Speech-to-Text API**: Charges are based on the duration of audio processed. See the [Google Cloud Speech-to-Text pricing page](https://cloud.google.com/speech-to-text/pricing) for details.

### Benefits of Using Docker

- **Consistency**: Docker ensures that the application runs the same way on different machines by encapsulating all dependencies.
- **Isolation**: Keeps the application environment isolated, avoiding conflicts with other applications.
- **Ease of Deployment**: Simplifies the deployment process by providing a single command to build and run the application.
- **Scalability**: Docker containers can be easily scaled up or down depending on the load.

## 🧩 Code Overview 🧩

### `index.js`

- Initializes the WhatsApp client and sets up event listeners.
- Configures Express server with API endpoints and cron jobs for automated tasks.

### `services/cacheService.js`

- **initializeCacheDirectory**: Ensures the cache directory exists for storing fetched data.
- **writeToCache**: Writes data to the cache directory.
- **readFromCache**: Reads data from the cache directory.

### `services/newsletterService.js`

- **fetchAndProcessMessages**: Fetches and processes messages from WhatsApp groups, including text and media.
- **generateWeeklyNewsletter**: Generates a weekly newsletter summarizing group activities based on processed messages.
- **sendNewsletter**: Sends the generated newsletter to subscribers.

### `services/visionService.js`

- **describeImage**: Utilizes Google Cloud Vision API to describe images.
- **transcribeVoiceMessage**: Uses Google Cloud Speech-to-Text API to transcribe voice messages.

### `services/openaiService.js`

- **generateSummary**: Interfaces with OpenAI's GPT-3 to generate summaries of textual content.

### `gateways/vertexGateway.js`

- **describeImage**: Provides a gateway to interact with Google Cloud Vision API for image description.

### `gateways/openAIGateway.js`

- **generateSummary**: Provides a gateway to interact with OpenAI's GPT-3 for generating text summaries.

### `routes/newsletterRoutes.js`

- **GET /api/generate-newsletter**: Endpoint to trigger the newsletter generation process.
- **GET /api/send-newsletter**: Endpoint to send the latest generated newsletter.

### `clients/whatsappClient.js`

- **whatsappClient**: Configures and manages the WhatsApp client connection, including authentication and message handling.

### `handlers/messageHandlers.js`

- **handleGroupMessage**: Handles incoming messages from WhatsApp groups.
- **processMedia**: Processes media files, including images and voice messages.

### `config/config.js`

- Manages environment variables using dotenv for configuration.


## 🤝 Contributing 🤝

Feel free to open issues or submit pull requests if you have suggestions or improvements.

## 📜 License 📜

This project is licensed under the GNU Affero General Public License (AGPL). See the [LICENSE](LICENSE) file for details.

### LICENSE

```plaintext
GNU AFFERO GENERAL PUBLIC LICENSE
                       Version 3, 19 November 2007
...

