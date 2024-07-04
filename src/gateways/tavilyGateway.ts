// src/gateways/tavilyGateway.ts
import axios from 'axios';

const TAVILY_API_BASE_URL = 'https://api.tavily.com/search';
const TAVILY_API_KEY = process.env.TAVILY_API_KEY || '';

export interface TavilySearchParams {
  query: string;
  search_depth?: string;
  include_images?: boolean;
  include_answer?: boolean;
  include_raw_content?: boolean;
  max_results?: number;
  include_domains?: string[];
  exclude_domains?: string[];
}

export interface TavilySearchResponse {
  answer: string;
  query: string;
  response_time: string;
  follow_up_questions: string[];
  images: string[];
  results: {
    title: string;
    url: string;
    content: string;
    raw_content: string;
    score: number;
  }[];
}

export async function getTavilyData(params: TavilySearchParams): Promise<TavilySearchResponse> {
  try {
    const response = await axios.post(TAVILY_API_BASE_URL, {
      api_key: TAVILY_API_KEY,
      ...params,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching data from Tavily:', error);
    throw new Error('Error fetching data from Tavily');
  }
}
