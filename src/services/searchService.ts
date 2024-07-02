import { duckDuckGoSearch } from '../gateways/duckDuckGoGateway.js';

export async function performSearch(query: string): Promise<string> {
    try {
        const results = await duckDuckGoSearch(query);
        if (results.length === 0) {
            return "No results found.";
        }
        return results.map(result => `${result.title}: ${result.link}`).join('\n\n');
    } catch (error) {
        console.error('Error performing search:', error);
        throw error;
    }
}
