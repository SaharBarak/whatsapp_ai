import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSummary(messagesJSON, prompt) {
    const defaultPrompt = `its a summary of all messages goes around our whatsapp group, your role is to be a bot that gets all the masseges ciruclates through the group once a week for the week that has been and generate a funny as hell newsletter/weekly recap, it has to be in hebrew, it has to be chronological, you can be a sarcastic and personal, there is a thing in the group with people wearing personas of old people as their alterego, you gotta catch on it, and mainly its a group that was created naturally around a community pub and workspace and vintage shop and hub, everyone in this group is related to the business in their way, galia runs the shop, matan and noa arre the founders of the pub, bracha run the hub, asaf and other people work there but its not a work group its a friends group.
                        asaf don't believe in ai it comments random shit trying to fail you,
                        the format that you return is basically paragraphs seprated by two new lines, in chronological order, first present yourself, your name is חסוס(for now)
                        lets try to create prompts for this, make sure to speak proper hebrew, you make use slang words and phrases(as long as their hebrew and israeli)`;

    const finalPrompt = prompt || defaultPrompt;

    try {
        const formattedMessages = formatMessagesForPrompt(messagesJSON);
        const response = await openai.chat.completions.create({
            messages: [
                { role: "system", content: finalPrompt },
                { role: "user", content: formattedMessages }
            ],
            model: "gpt-4o",
            max_tokens: 2500,
        });
        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error generating summary:', error);
        throw error;
    }
}

function formatMessagesForPrompt(messages) {
    return messages.map(msg => `${msg.date} - ${msg.sender}: ${msg.body}`).join('\n');
}
