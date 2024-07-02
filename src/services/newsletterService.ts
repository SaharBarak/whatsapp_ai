import { fetchGroupHeader, fetchGroupImagesFromCache } from './groupService.js';
import { generateSummary } from './openaiService.js';
import db from '../clients/mongoClient.js';
import { RecentGroupMessage, toSimplifiedAPI } from '../types/RecentGroupMessage.js';
import { SimplifiedMessageForAPI } from '../types/SimplifiedMessageForAPI.js';

async function fetchAndProcessMessages(
  groupName: string
): Promise<RecentGroupMessage[]> {
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  const query = { timestamp: { $gte: oneWeekAgo / 1000 } };
  const messages = await db.find('messages', query);
  return messages.map((msg: any) => ({
    groupName: msg.groupName,
    senderName: msg.sender,
    body: msg.body,
    timestamp: msg.timestamp * 1000, // Convert to milliseconds
    sender: msg.sender,
    type: msg.type,
    hasMedia: msg.hasMedia,
    description: msg.description,
    date: new Date(msg.timestamp * 1000).toLocaleString('he-IL'),
  }));
}

export async function generateNewsletterText(
  groupName: string,
   prompt?: string
  ): Promise<string> {
  const recentMessages: RecentGroupMessage[] = await fetchAndProcessMessages(groupName);
  const visualEnrichedMessages = recentMessages.map((msg) => {
    if (msg.type === 'image' && msg.description) {
      return {
        ...msg,
        body: `${msg.body}\n\nתיאור: ${msg.description}`,
      };
    }
    return msg;
  });
  visualEnrichedMessages.sort((a, b) => a.timestamp - b.timestamp);
  const recentGroupMessages: SimplifiedMessageForAPI[] = visualEnrichedMessages.map((msg) =>
    toSimplifiedAPI(msg));
  const finalSummary = await generateSummary(recentGroupMessages, prompt);
  return finalSummary;
}

export async function generateNewsletterObject(
  groupName: string,
  prompt: string,
): Promise<{ groupName: string;
   summaries: string[];
    images: string[] }> {
  const groupHeader = await fetchGroupHeader(groupName);
  const newsletterText = await generateNewsletterText(groupName, prompt);
  const summaryArray = newsletterText
    .split('\n\n')
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
  const imageUrls = await fetchGroupImagesFromCache();

  return {
    groupName: groupHeader.name,
    summaries: summaryArray,
    images: imageUrls,
  };
}
