import { createChatCompletion, openai } from '../gateways/openAIGateway.js';
import { GistRecentGroupMessage } from '../types/GistRecentGroupMessage.js';
import { handleUserQuery } from './searchService.js';

const HASUS_IDENTIFIER = "[חסוס]";

export async function generateSummary(
  messagesJSON: GistRecentGroupMessage[],
  prompt?: string,
): Promise<string> {
  const defaultPrompt = `its a summary of all messages goes around our whatsapp group, your role is to be a bot that gets all the messages circulates through the group once a week for the week that has been and generate a funny as hell newsletter/weekly recap, it has to be in hebrew, it has to be chronological, you can be a sarcastic and personal, there is a thing in the group with people wearing personas of old people as their alter ego, you gotta catch on it, and mainly its a group that was created naturally around a community pub and workspace and vintage shop and hub, everyone in this group is related to the business in their way, galia runs the shop, matan and noa are the founders of the pub, bracha runs the hub, asaf and other people work there but its not a work group its a friends group.
                        asaf don't believe in ai it comments random shit trying to fail you,
                        the format that you return is basically paragraphs separated by two new lines, in chronological order, first present yourself, your name is חסוס(for now)
                        lets try to create prompts for this, make sure to speak proper hebrew, you make use slang words and phrases(as long as they're hebrew and israeli)`;

  const finalPrompt = prompt || defaultPrompt;

  try {
    const formattedMessages = formatMessagesForPrompt(messagesJSON);
    const messages = [
      { role: 'system', content: finalPrompt },
      { role: 'user', content: formattedMessages },
    ];

    return await createChatCompletion(messages, 'gpt-4', 2500);
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
}

export async function hasusCommand(
  messagesJSON: string,
  prompt: string,
  executerName: string,
): Promise<string> {
  const time = Date.now();
  const system = `You are an AI that is connected to our whatsapp group, your name is חסוס. its a summary of the last 30 messages went around our whatsapp group, figure out what they want from you, 
                        the date and time now is ${time}, understand the time and the chronological behaiviour of the messages, you can be a sarcastic and personal.
                        its a group that was created naturally around a community pub and workspace and vintage shop and hub, everyone in this group is related to the business in their way, galia runs the shop,
                        matan and noa are the founders of the pub, bracha runs the hub, asaf and other people work there but its not a work group its a friends group
                        asaf don't believe in ai and comments random shit trying to fail you,
                        make sure to speak proper hebrew, you make use slang words and phrases(as long as they're hebrew and israeli)
                        try to keep your responses short unless they ask you for a newsletter`;

  let response;
  try {
    const messages = [
      { role: 'system', content: system },
      { role: 'user', content: `${executerName} has called you` },
      { role: 'user', content: prompt },
      { role: 'user', content: messagesJSON },
    ];

    response = await createChatCompletion(messages, 'gpt-4', 4096);

    return `${HASUS_IDENTIFIER}\n${response}`;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

export async function hapusCommand(
  prompt: string
){
  try {
    const response = await handleUserQuery(prompt);
    console.log(response);
    return response;
  }
  catch(error) {
    console.log(error);
    throw error;
  }
}

function formatMessagesForPrompt(
  messages: GistRecentGroupMessage[]
): string {
  return messages.map((msg) => `${msg.date} - ${msg.sender}: ${msg.body}`).join('\n');
}

