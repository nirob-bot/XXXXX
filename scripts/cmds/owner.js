module.exports = {
  config: {
    name: "owner",
    version: "1.0",
    author: "NIROB",
    countDown: 5,
    role: 0,
    shortDescription: "admin and info",
    longDescription: "bot owner info",
    category: "auto ✅"
  },

  onStart: async function ({
    event,
    message,
    getLang,
    usersData,
    threadsData
  }) {
    const userData = await usersData.get(event.senderID);
    const userName = userData.name;
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

    // 📦 Short Version Message (default)
    const infoMessage = `👤 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢
━━━━━━━━━━━━━━━
• 𝗡𝗔𝗠𝗘: ARIJIT 🇮🇳
• 𝗙𝗕: fb.com/share/1D8LnYLkLt/
• 𝗜𝗚: itz_arijit_777
• 📧: arijitnaha2@gmail.com

🤖 𝗕𝗢𝗧: ALYA BOT
🏠 GC: ${threadName}
🕒 ${dateStr} | ${timeStr}
━━━━━━━━━━━━━━━`;

    /*
    // 🧾 Long Version (optional — uncomment if needed)
    const infoMessage = `╔╝❮${userName}❯╚╗
━━━━━━━━━━━━━━━━━━━━━━
👤 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢
━━━━━━━━━━━━━━━━━━━━━━
• 𝗡𝗔𝗠𝗘: ARIJIT  
• 𝗔𝗗𝗗𝗥𝗘𝗦𝗦: KOLKATA  
• 𝗚𝗘𝗡𝗗𝗘𝗥: MALE  
• 𝗔𝗚𝗘: 20  
• 𝗥𝗘𝗟𝗔𝗧𝗜𝗢𝗡𝗦𝗛𝗜𝗣: SINGLE  
• 𝗪𝗢𝗥𝗞: NTG  

📧 𝗚𝗠𝗔𝗜𝗟: arijitnaha2@gmail.com  
📘 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞: fb.com/share/1D8LnYLkLt/  
📸 𝗜𝗡𝗦𝗧𝗔: itz_arijit_777  

━━━━━━━━━━━━━━━━━━━━━━
🤖 𝗕𝗢𝗧: ALYA BOT  
🏠 𝗚𝗥𝗢𝗨𝗣: ${threadName}  
🕒 𝗧𝗜𝗠𝗘: ${dateStr} | ${timeStr}  
━━━━━━━━━━━━━━━━━━━━━━`;
    */

    await message.reply({
      body: infoMessage,
      attachment: await global.utils.getStreamFromURL("https://files.catbox.moe/klc7er.mp4")
    });
  }
};
