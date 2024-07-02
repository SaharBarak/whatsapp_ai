import axios from 'axios';

interface SearchResult {
    title: string;
    link: string;
}

export async function duckDuckGoSearch(query: string): Promise<SearchResult[]> {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`;
    const response = await axios.get(url);
    const results = response.data.RelatedTopics.map((item: any) => ({
        title: item.Text,
        link: item.FirstURL,
    }));
    return results;
}
