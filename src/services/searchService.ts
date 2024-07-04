// src/services/tavilyService.ts
import { getTavilyData, TavilySearchParams, TavilySearchResponse } from '../gateways/tavilyGateway';
import { openai } from '../gateways/openAIGateway';

export async function fetchTavilyInfo(query: string): Promise<string> {
  const params: TavilySearchParams = {
    query,
    search_depth: 'basic',
    include_answer: true,
    include_images: false,
    include_raw_content: false,
    max_results: 5,
  };

  try {
    const data: TavilySearchResponse = await getTavilyData(params);
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a translator from english to hebrew. all empiric mesurement units are translated to metric, all finance to New israeli shekel' },
        { role: 'user', content: data.answer },
      ],
      max_tokens: 500,
    });

    const translatedAnswer = response.choices[0].message?.content?.trim();
    if (!translatedAnswer) {
      throw new Error('No translation received from OpenAI');
    }

    return `[חסוס]\n ${translatedAnswer}`;
    
  } catch (error) {
    console.error('Error processing Tavily data:', error);
    throw new Error('Failed to fetch Tavily data');
  }
}
