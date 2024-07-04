import { OpenAI } from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function createChatCompletion(messages: any[], model: string = 'gpt-4o', maxTokens: number = 2500): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model,
      messages,
      max_tokens: maxTokens,
    });

    if (response.choices[0].message.content) {
      return response.choices[0].message.content.trim();
    }
    throw new Error('No response from OpenAI');
  } catch (error) {
    console.error('Error creating chat completion:', error);
    throw error;
  }
}

