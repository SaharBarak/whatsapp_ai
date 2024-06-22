import whatsappClient from '../clients/whatsappClient.js';

export async function fetchGroupMessages(groupName) {
    const chats = await whatsappClient.getChats();
    const group = chats.find(chat => chat.isGroup && chat.name === groupName);
    
    if (group) {
        const messages = await group.fetchMessages({ limit: 10000 });
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
