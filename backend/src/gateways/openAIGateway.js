import OpenAI from 'openai/index.js';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

function formatMessagesForPrompt(messages) {
    return messages.map(msg => {
        return `${msg.date} - ${msg.sender}:\n${msg.body}`;
    }).join("\n\n");
}

export async function generateSummary(messagesJSON, prompt) {
    const defaultPrompt = "סכם את ההודעות הבאות לידיעון שבועי:";
    const finalPrompt = prompt || defaultPrompt;

    try {
        const formattedMessages = formatMessagesForPrompt(messagesJSON);
        const response = await openai.completions.create({
            model: "text-davinci-003",
            prompt: `${finalPrompt}\n\n${formattedMessages}`,
            max_tokens: 1024,
        });
        return response.choices[0].text.trim();
    } catch (error) {
        console.error('Error generating summary:', error);
        throw error;
    }
}
