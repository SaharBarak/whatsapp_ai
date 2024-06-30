import { RecentGroupMessage } from './RecentGroupMessage';

export interface GistRecentGroupMessage {
  body: string;
  timestamp: number;
  sender: string;
  type: string;
  date: string;
}

export function toRecent(
  message: GistRecentGroupMessage,
  groupName: string,
  senderName: string,
  hasMedia: boolean,
  description?: string,
): RecentGroupMessage {
  return {
    groupName,
    senderName,
    body: message.body,
    timestamp: message.timestamp,
    type: message.type,
    hasMedia,
    description,
    date: message.date,
  };
}
