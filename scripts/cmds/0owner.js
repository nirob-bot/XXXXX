module.exports = {
  config: {
    name: "owner",
    version: "1.0",
    author: "Arijit",
    countDown: 5,
    role: 0,
    shortDescription: "bot owner info (noprefix)",
    longDescription: "Shows bot owner info without needing prefix",
    category: "auto ✅"
  },

  onStart: async function () {},

  onChat: async function ({ event, message, usersData, threadsData }) {
    if (!event.body) return;
    const body = event.body.toLowerCase();

    // Trigger words
    const triggers = ["owner", "bot owner", "who is owner", "alya owner"];
    if (!triggers.includes(body)) return;

    const userData = await usersData.get(event.senderID);
    const threadData = await threadsData.get(event.threadID);
    const threadName = threadData.threadName;

    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric"
    });
    const timeStr = now.toLocaleTimeString("en-US", {
      timeZone: "Asia/Dhaka",
      hour12: true
    });

    const infoMessage = `👤 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢
━━━━━━━━━━━━━━━
• 𝗡𝗔𝗠𝗘: 𝐀 𝐑 𝐈 𝐉 𝐈 𝐓 👑
• 𝗡𝗜𝗖𝗞𝗡𝗔𝗠𝗘 : 𝐀𝐑𝐔
• 𝗔𝗗𝗗𝗥𝗘𝗦𝗦: 𝐊𝐎𝐋𝐊𝐀𝐓𝐀 🇮🇳
• 𝗚𝗘𝗡𝗗𝗘𝗥: 𝐌𝐀𝐋𝐄 
• 𝗔𝗚𝗘: 𝟐𝟎   
• 𝗙𝗕 🆔: 𝐍𝐞𝐟𝐚𝐫𝐢𝐨𝐮𝐬 𝐀𝐫𝐢𝐣𝐢𝐭 𝐈𝐈  
• 𝐈𝐍𝐒𝐓𝐀 🆔: 𝐢𝐭𝐳_𝐚𝐫𝐢𝐣𝐢𝐭_𝟕𝟕𝟕

🤖 𝗕𝗢𝗧: 𝐀𝐋𝐘𝐀 𝐂𝐇𝐀𝐍 🐱🎀
🏠 𝐆𝐂: ${threadName}
🕒 ${dateStr} | ${timeStr}
━━━━━━━━━━━━━━━`;

    return message.reply({
      body: infoMessage,
      attachment: await global.utils.getStreamFromURL("https://files.catbox.moe/klc7er.mp4")
    });
  }
};
