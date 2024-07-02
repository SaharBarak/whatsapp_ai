import { googleSearch, GoogleSearchResponse } from '../gateways/serpGateway.js';
import { openai } from '../gateways/openAIGateway.js';

const HASUS_IDENTIFIER = "[חסוס]";


interface ChatCompletionMessageParam {
    role: 'system' | 'user' | 'assistant' | 'function';
    content?: string;
    name?: string;
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
  
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages,
      functions: [functionSchema],
      function_call: { name: 'google_search' },
    });
  
    const choice = response.choices[0];
  
    if (choice.finish_reason === 'function_call') {
      const functionCall = choice.message?.function_call;
      if (functionCall) {
        const functionName = functionCall.name;
        const functionArguments = JSON.parse(functionCall.arguments);
  
        if (functionName === 'google_search') {
          const searchResults = await googleSearch(functionArguments.query);
  
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
  
    throw new Error('No valid function call returned from OpenAI');
  }
  