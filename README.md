# WhatsApp Newsletter Bot

A WhatsApp bot that generates a weekly newsletter from group chat messages, including text, images, and voice messages. The bot leverages OpenAI's GPT-3 for generating summaries and Google Cloud APIs for image recognition and voice transcription.

## Features

- **Weekly Newsletter Generation**: Collects messages from the past week and generates a summary.
- **Voice Message Transcription**: Transcribes voice messages using Google Cloud Speech-to-Text.
- **Image Description**: Describes images using Google Cloud Vision.
- **Language Support**: Generates newsletters in Hebrew.
- **Endpoints**: Provides endpoints to generate and send the latest newsletter.
- **Automated Tasks**: Cron jobs for automatic newsletter generation and sending.

## Prerequisites

- Node.js (>=14.x)
- Docker
- Google Cloud Service Account with Vision and Speech-to-Text APIs enabled
- OpenAI API key
- WhatsApp Web session setup

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```plaintext
PORT=3000
GROUP_NAME=your-group-name
OPENAI_API_KEY=your-openai-api-key
GOOGLE_APPLICATION_CREDENTIALS=path-to-your-google-service-account.json
```

## Installation

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
    ```

## Running the Bot

### Using Node.js

1. Start the bot:

    ```bash
    npm start
    ```

2. Scan the QR code with your WhatsApp to authenticate.

### Using Docker

1. Build the Docker image:

    ```bash
    docker build -t whatsapp-newsletter .
    ```

2. Run the Docker container:

    ```bash
    docker run --env-file .env -it --rm whatsapp-newsletter
    ```

## API Endpoints

### Generate Newsletter

Generates the newsletter for the past week.

**Endpoint**: `GET /generate-newsletter`

**Response**:
- `200 OK`: Newsletter generated successfully.
- `404 Not Found`: Group not found.
- `500 Internal Server Error`: Error generating newsletter.

### Send Newsletter

Sends the latest generated newsletter to the WhatsApp group.

**Endpoint**: `GET /send-newsletter`

**Response**:
- `200 OK`: Newsletter sent successfully.
- `404 Not Found`: Group not found.
- `500 Internal Server Error`: Error sending newsletter.

## Cron Jobs

Automate the generation and sending of the newsletter using cron jobs.

## ToDo

- **Process Voice Messages**: Implement the transcription logic using a service like Google Cloud Speech-to-Text.
- **Optimize the Prompt for a Funny, Cheerful Newsletter**: Enhance the prompt to make the newsletter more engaging and cheerful.
- **Process Likes, Emojis, Links, and Social Media Posts**: Extend the message processing to include likes, emojis, links, and social media posts.
- **Add Basic Styling to the Newsletter**: Initially add simple text formatting and then later convert it to a PDF.
- **Manage Space for OpenAI API Request**: Implement a method to handle a large number of messages by summarizing or chunking data before sending it to the OpenAI API.
- **Decouple and Modularize the Code**: Refactor the codebase to separate different functionalities into modules.


### Setup

The bot uses `node-cron` to schedule tasks. These tasks are configured to run weekly.

1. Install `node-cron`:

    ```bash
    npm install node-cron
    ```

2. Add the following to `index.js`:

    ```javascript
    import cron from 'node-cron';
    import axios from 'axios';

    // Schedule tasks to be run on the server.
    cron.schedule('0 0 * * 0', () => { // Runs every Sunday at midnight
        console.log('Running cron job to generate and send newsletter...');
        axios.get('http://localhost:3000/generate-newsletter')
            .then(() => {
                return axios.get('http://localhost:3000/send-newsletter');
            })
            .catch(error => {
                console.error('Error during cron job execution:', error);
            });
    });
    ```

## Cost Considerations

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

## Code Overview

### `index.js`

- Initializes WhatsApp client with Puppeteer.
- Defines handlers for WhatsApp messages and QR code generation.
- Implements functions to process messages, transcribe voice messages, describe images, and generate summaries.
- Sets up Express endpoints to generate and send newsletters.
- Includes cron jobs for scheduling automatic tasks.

### Functions

- **handleGroupMessage**: Fetches messages weekly and processes them.
- **processGroupMessages**: Processes the group messages, including text, images, and voice messages.
- **generateSummary**: Generates a summary of the messages using OpenAI's GPT-3.
- **describeImage**: Describes images using Google Cloud Vision.
- **transcribeVoiceMessage**: Transcribes voice messages using Google Cloud Speech-to-Text.
- **listenToGroup**: Listens to a specified WhatsApp group.

## Contributing

Feel free to open issues or submit pull requests if you have suggestions or improvements.

## License

This project is licensed under the GNU Affero General Public License (AGPL). See the [LICENSE](LICENSE) file for details.

---

### LICENSE

```plaintext
GNU AFFERO GENERAL PUBLIC LICENSE
                       Version 3, 19 November 2007
...

