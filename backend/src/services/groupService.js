import whatsappClient from '../clients/whatsappClient.js';

async function fetchAllMessages(group, limit = 10000) {
    let messages = [];
    let loadEarlier = true;

    while (loadEarlier && messages.length < limit) {
        const batch = await group.fetchMessages({ limit: 1000 });

        if (batch.length === 0) {
            loadEarlier = false;
            break;
        }

        messages = messages.concat(batch);

        const lastMessageId = batch[batch.length - 1].id._serialized;
        await group.loadEarlierMessages(lastMessageId);

        console.log(`Fetched ${batch.length} messages, total: ${messages.length}`);
    }

    return messages.slice(0, limit);
}

export async function fetchGroupMessages(groupName) {
    const chats = await whatsappClient.getChats();
    const group = chats.find(chat => chat.isGroup && chat.name === groupName);
    
    if (group) {
        const messages = await fetchAllMessages(group);
        console.log(`Total messages fetched: ${messages.length}`);
        return messages;
    } else {
        throw new Error('Group not found');
    }
}

export async function sendGroupMessage(groupName, message) {
    const chats = await whatsappClient.getChats();
    const group = chats.find(chat => chat.isGroup && chat.name === groupName);

    if (group) {
        await group.sendMessage(message);
    } else {
        throw new Error('Group not found');
    }
}
