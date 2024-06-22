import whatsappClient from '../clients/whatsappClient.js';

async function fetchGroupHeader(groupName) {
    const chats = await whatsappClient.getChats();
    const group = chats.find(chat => chat.isGroup && chat.name === groupName);

    if (group) {
        const groupImage = await group.getProfilePicUrl();
        return {
            name: group.name,
            image: groupImage
        };
    } else {
        throw new Error('Group not found');
    }
}

async function fetchGroupMessages(groupName) {
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

async function sendGroupMessage(groupName, message) {
    const chats = await whatsappClient.getChats();
    const group = chats.find(chat => chat.isGroup && chat.name === groupName);

    if (group) {
        await group.sendMessage(message);
    } else {
        throw new Error('Group not found');
    }
}


async function fetchGroupImages(groupName) {
    const messages = await fetchGroupMessages(groupName);
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

    const imageMessages = messages.filter(msg => msg.hasMedia && msg.type === 'image' && msg.timestamp * 1000 >= oneWeekAgo);

    const imageUrls = await Promise.all(imageMessages.map(async (msg) => {
        const media = await msg.downloadMedia();
        return media.url;
    }));

    return imageUrls;
}
export { fetchGroupHeader, fetchGroupMessages, sendGroupMessage, fetchGroupImages };
