import { GistRecentGroupMessage } from './GistRecentGroupMessage';
import { SimplifiedMessageForAPI } from './SimplifiedMessageForAPI';

export interface RecentGroupMessage {
  groupName: string;
  senderName: string;
  body: string;
  timestamp: number;
  type: string;
  hasMedia: boolean;
  description?: string;
  date: string;
}

export function toGist(message: RecentGroupMessage): GistRecentGroupMessage {
  return {
    body: message.body,
    timestamp: message.timestamp,
    sender: message.senderName,
    type: message.type,
    date: message.date,
  };
}

export function toSimplifiedAPI(message: RecentGroupMessage): SimplifiedMessageForAPI {
  return {
    body: message.body,
    timestamp: message.timestamp,
    sender: message.senderName,
    type: message.type,
    date: message.date,
  };
}
