module.exports = {
  config: {
    name: "owner",
    version: "1.0",
    author: "NIROB",
    role: 0,
    shortDescription: "admin and info",
    longDescription: "bot owner info",
    category: "auto ✅"
  },

  onMessage: async function({ event, message, usersData, threadsData, api }) {
    // যদি মেসেজে শুধু "owner" লেখা থাকে, তখন কমান্ড রান করানো হবে
    if (event.body && event.body.toLowerCase() === "owner") {
      const userData = await usersData.get(event.senderID);
      const userName = userData.name || "User";
      const threadData = await threadsData.get(event.threadID);
      const threadName = threadData.threadName || "Group";

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
🏠 GC: ${threadName}
🕒 ${dateStr} | ${timeStr}
━━━━━━━━━━━━━━━`;

      return api.sendMessage({
        body: infoMessage,
        attachment: await global.utils.getStreamFromURL("https://files.catbox.moe/klc7er.mp4")
      }, event.threadID);
    }
  }
};
