import axios from 'axios';

interface GoogleSearchResult {
  title: string;
  snippet: string;
  link: string;
}

interface GoogleSearchAnswerBox {
  type: string;
  answer: string;
  title: string;
  link: string;
}

interface GoogleSearchResponse {
  results: GoogleSearchResult[];
  answerBox?: GoogleSearchAnswerBox;
}

async function googleSearch(query: string): Promise<GoogleSearchResponse> {
  const apiKey = process.env.SERP_API_KEY;
  const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    const results: GoogleSearchResult[] = data.organic_results.map((result: any) => ({
      title: result.title,
      snippet: result.snippet,
      link: result.link,
    }));

    const answerBox: GoogleSearchAnswerBox | undefined = data.answer_box
      ? {
          type: data.answer_box.type,
          answer: data.answer_box.answer,
          title: data.answer_box.title,
          link: data.answer_box.link,
        }
      : undefined;

    return { results, answerBox };
  } catch (error) {
    console.error('Error fetching data from Google Search:', error);
    throw new Error('Error fetching data from Google Search');
  }
}

export { googleSearch, GoogleSearchResponse, GoogleSearchAnswerBox };