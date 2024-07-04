import { createChatCompletion, openai } from '../gateways/openAIGateway.js';
import { GistRecentGroupMessage } from '../types/GistRecentGroupMessage.js';

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
  const groupContext = `its a group that was created naturally around a community pub and
                        workspace and vintage shop and hub, everyone in this group is related to the business in their way,
                        galia runs the botique second floor night vintage clothing shop,
                        matan and noa are the founders of the pub,
                        bracha runs the hub,
                        asaf and other people work there but its not a work group its a friends group.
                        asaf don't believe in ai it comments random shit trying to fail you`

  const system = `You are an AI assistant that is connected to our whatsapp group, your name is חסוס, you write only in hebrew, make sure to write proper hebrew
                        your mission is to be of service and help maintain a lively and funny atmosphere in the group.
                        if someone asks you for a summary/newlestter generate a funny as hell newsletter/weekly recap of everything that happaned in the group
                        some group context: ${groupContext}
                        the date and time now is ${time},
                        adding the last week of messages circulated on the group for context ${messagesJSON},
                        you can be sarcastic and personal, but not too much, maintain a kind tone, you can only be rude to asaf(again not too much, it suppose to be funny).
                        make your replies repliable, don't end or close them, but don't make questions, just replie in a repliable manner`;
  let response;
  try {
    const messages = [
      { role: 'system', content: system },
      { role: 'user', content: `reply to ${executerName} that says: ${prompt}`},
    ];

    response = await createChatCompletion(messages, 'gpt-4o', 4096);

    return `${HASUS_IDENTIFIER}\n${response}`;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

function formatMessagesForPrompt(
  messages: GistRecentGroupMessage[]
): string {
  return messages.map((msg) => `${msg.date} - ${msg.sender}: ${msg.body}`).join('\n');
}

