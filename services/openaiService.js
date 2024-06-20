import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

function formatMessagesForPrompt(messages) {
    return messages.map(msg => {
        return `${msg.date} - ${msg.sender}:\n${msg.body}`;
    }).join("\n\n");
}

export async function generateSummary(messagesJSON, prompt) {
    try {
        const formattedMessages = formatMessagesForPrompt(messagesJSON);
        const response = await openai.completions.create({
            model: "text-davinci-003",
            prompt: `${prompt}\n\n${formattedMessages}`,
            max_tokens: 1024,
        });
        return response.choices[0].text.trim();
    } catch (error) {
        console.error('Error generating summary:', error);
        throw error;
    }
}
