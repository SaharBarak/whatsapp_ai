import OpenAI from 'openai/index.js';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// function formatMessagesForPrompt(messages) {
//     return messages.map(msg => {
//         return `${msg.date} - ${msg.sender}:\n${msg.body}`;
//     }).join("\n\n");
// }

export async function generateSummary(messagesJSON, prompt) {
    const defaultPrompt = `שלום AI! יש לי אובייקט שמייצג סיכום של כל ההודעות שהסתובבו בקבוצת הוואטסאפ שלנו במהלך השבוע האחרון. האובייקט מכיל את כל המסרים, תאריכים, ושמות השולחים.

התפקיד שלך הוא לקחת את כל ההודעות מהשבוע החולף וליצור ניוזלטר שבועי מצחיק בטירוף. הסיכום צריך להיות כרונולוגי, סרקסטי ואישי. הקבוצה שלנו כוללת אנשים עם פרסונות של אנשים מבוגרים כאלטר אגו שלהם, וכולנו קשורים לקהילת פאב, חנות וינטג' ומתחם עבודה משותף. גאליה מנהלת את החנות, מתן ונועה הם המייסדים של הפאב, ברכה מנהלת את ההאב, ואסף ועוד אנשים עובדים שם. זוהי קבוצה חברית ולא קבוצת עבודה.

הפורמט שתחזיר צריך להיות פסקאות מופרדות על ידי שתי שורות ריקות, בסדר כרונולוגי. ראשית, הצג את עצמך - שמך הוא חסוס.

הנה כמה פרטים שיעזרו לך:
1. סרקסטיות ושנינות מתקבלות בברכה.
2. הקבוצה כוללת אלטר אגו של דמויות מבוגרות.
3. כולם קשורים בדרך כלשהי לקהילה של הפאב, החנות והמתחם המשותף.
4. זהו סיכום שבועי של כל ההודעות שהסתובבו בקבוצה.
5. אתה יכול להוסיף אימוג׳ים כדי להוסיף צבע להודעות.

בהצלחה חסוס!`;

    const finalPrompt = prompt || defaultPrompt;

    try {
        const formattedMessages = formatMessagesForPrompt(messagesJSON);
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${finalPrompt}\n\n${formattedMessages}`,
            max_tokens: 1024,
        });
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error generating summary:', error);
        throw error;
    }
}

function formatMessagesForPrompt(messages) {
    return messages.map(msg => `${msg.date} - ${msg.sender}: ${msg.body}`).join('\n');
}
