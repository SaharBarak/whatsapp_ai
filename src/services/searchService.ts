import { googleSearch, GoogleSearchResponse } from '../gateways/serpGateway.js';
import { openai } from '../gateways/openAIGateway.js';
import { ChatCompletionMessageParam, ChatCompletionCreateParams } from 'openai/resources/chat';

const HASUS_IDENTIFIER = "[חסוס]";

interface ToolCall {
  name: string;
  arguments: string;
}

export async function handleUserQuery(query: string): Promise<string> {
  const functionSchema = {
    name: 'google_search',
    description: 'Fetches search results from Google',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query to fetch results for',
        },
      },
      required: ['query'],
    },
  };

  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: 'You are an AI assistant. You can use the tool "google_search" to fetch search results from Google.',
    },
    {
      role: 'user',
      content: `search: ${query}`,
    },
  ];

  const requestPayload: ChatCompletionCreateParams = {
    model: 'gpt-4',
    messages: messages,
    functions: [functionSchema],
    function_call: 'auto',
  };

  const response = await openai.chat.completions.create(requestPayload);

  const choice = response.choices[0];

  if (choice.finish_reason === 'function_call') {
    const toolCall: ToolCall = choice.message?.function_call as ToolCall;
    if (toolCall) {
      const toolName = toolCall.name;
      const toolArguments = JSON.parse(toolCall.arguments);

      if (toolName === 'google_search') {
        const searchResults = await googleSearch(toolArguments.query);

        const formattedResults = searchResults.results
          .map((result: { title: string; snippet: string; link: string }) => `${result.title}: ${result.snippet}\nLink: ${result.link}`)
          .join('\n\n');

        messages.push({
          role: 'function',
          name: 'google_search',
          content: formattedResults,
        });

        const finalResponse = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: messages,
          functions: [functionSchema],
        });

        if (finalResponse.choices[0].message?.content) {
          return finalResponse.choices[0].message.content.trim();
        }
      }
    }
  }

  throw new Error('No valid tool call returned from OpenAI');
}
