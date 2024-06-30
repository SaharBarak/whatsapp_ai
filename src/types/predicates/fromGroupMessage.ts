import { Message } from 'whatsapp-web.js';
import { RecentGroupMessage } from '../RecentGroupMessage';

export function fromGroupMessage(msg: Message, senderName: string): RecentGroupMessage {
  return {
    groupName: msg.from,
    body: msg.body,
    timestamp: msg.timestamp,
    sender: senderName,
    type: msg.type,
    hasMedia: msg.hasMedia,
    date: new Date(msg.timestamp * 1000).toISOString(),
    description: undefined, // Initially set to undefined, will be set if the message is an image
  };
}
