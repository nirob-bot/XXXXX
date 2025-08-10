const fs = require("fs");

module.exports = {
  config: {
    name: "slot",
    version: "3.0",
    author: "Arijit",
    countDown: 3,
    role: 0,
    shortDescription: "Slot game 🙂",
    longDescription: "Try your luck in a slot game",
    category: "game"
  },

  langs: {
    en: {
      invalid_amount: "𝗣𝗹𝗲𝗮𝘀𝗲 𝗲𝗻𝘁𝗲𝗿 𝗮 𝘃𝗮𝗹𝗶𝗱 𝗮𝗺𝗼𝘂𝗻𝘁 😿💅",
      not_enough_money: "𝗣𝗹𝗲𝗮𝘀𝗲 𝗰𝗵𝗲𝗰𝗸 𝘆𝗼𝘂𝗿 𝗯𝗮𝗹𝗮𝗻𝗰𝗲 🤡",
      cooldown: "❌ | 𝐘𝐨𝐮 𝐡𝐚𝐯𝐞 𝐫𝐞𝐚𝐜𝐡𝐞𝐝 𝐲𝐨𝐮𝐫 𝐬𝐥𝐨𝐭 𝐥𝐢𝐦𝐢𝐭. 𝐓𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐢𝐧 %1𝐡 %2𝐦.",
      win_message: ">🎀\n• 𝐁𝐚𝐛𝐲, 𝐘𝐨𝐮 𝐰𝐨𝐧 $%1\n• 𝐆𝐚𝐦𝐞 𝐑𝐞𝐬𝐮𝐥𝐭𝐬 [ %2 | %3 | %4 ]",
      lose_message: ">🎀\n• 𝐁𝐚𝐛𝐲, 𝐘𝐨𝐮 𝐥𝐨𝐬𝐭 $%1\n• 𝐆𝐚𝐦𝐞 𝐑𝐞𝐬𝐮𝐥𝐭𝐬 [ %2 | %3 | %4 ]",
      jackpot_message: ">🎀 𝐉𝐚𝐜𝐤𝐩𝐨𝐭! 𝐘𝐨𝐮 𝐰𝐨𝐧 $%1 𝐰𝐢𝐭𝐡 𝐭𝐡𝐫𝐞𝐞 ❤ 𝐬𝐲𝐦𝐛𝐨𝐥𝐬, 𝐁𝐚𝐛𝐲!\n• 𝐆𝐚𝐦𝐞 𝐑𝐞𝐬𝐮𝐥𝐭𝐬 [ %2 | %3 | %4 ]"
    }
  },

  onStart: async function ({ args, message, event, usersData, getLang }) {
    const { senderID } = event;
    const amount = parseInt(args[0]);
    const userData = await usersData.get(senderID);

    // Amount validation
    if (isNaN(amount) || amount <= 0) return message.reply(getLang("invalid_amount"));
    if (amount > userData.money) return message.reply(getLang("not_enough_money"));

    // Play limit tracking
    const now = Date.now();
    const HOUR = 60 * 60 * 1000;
    if (!userData.data.slotHistory) userData.data.slotHistory = [];

    // Remove plays older than 1 hour
    userData.data.slotHistory = userData.data.slotHistory.filter(ts => now - ts < HOUR);

    if (userData.data.slotHistory.length >= 10) {
      const nextPlayTime = userData.data.slotHistory[0] + HOUR;
      const diff = nextPlayTime - now;
      const hours = Math.floor(diff / (60 * 60 * 1000));
      const minutes = Math.ceil((diff % (60 * 60 * 1000)) / (60 * 1000));
      return message.reply(getLang("cooldown", hours, minutes));
    }

    // Record play time
    userData.data.slotHistory.push(now);

    // Generate slot result with fixed probabilities
    const slots = ["💚", "💛", "💙", "💜", "🤎", "🤍", "❤"];
    let result = [];
    let winnings = -amount; // default lose
    const roll = Math.random() * 100; // 0 - 100%

    if (roll < 1) {
      // Jackpot 1%
      result = ["❤", "❤", "❤"];
      winnings = amount * 10;
    } else if (roll < 6) {
      // 5x win 5%
      const symbol = slots.filter(s => s !== "❤")[Math.floor(Math.random() * (slots.length - 1))];
      result = [symbol, symbol, symbol];
      winnings = amount * 5;
    } else if (roll < 38) {
      // 3x win 32%
      const symbol = slots[Math.floor(Math.random() * slots.length)];
      result = [symbol, symbol, symbol];
      winnings = amount * 3;
    } else {
      // Loss 62%
      for (let i = 0; i < 3; i++) {
        result.push(slots[Math.floor(Math.random() * slots.length)]);
      }
      // Ensure not matching 3
      if (result[0] === result[1] && result[1] === result[2]) {
        result[2] = slots.filter(s => s !== result[0])[0];
      }
    }

    // Update money
    await usersData.set(senderID, {
      money: userData.money + winnings,
      data: userData.data
    });

    const formattedWinnings = formatMoney(Math.abs(winnings));
    let replyText = "";

    if (winnings > 0 && result[0] === "❤" && result[1] === "❤" && result[2] === "❤") {
      replyText = getLang("jackpot_message", formattedWinnings, ...result);
    } else if (winnings > 0) {
      replyText = getLang("win_message", formattedWinnings, ...result);
    } else {
      replyText = getLang("lose_message", formattedWinnings, ...result);
    }

    return message.reply(replyText);
  }
};

// Money formatting helper
function formatMoney(amount) {
  if (amount >= 1e12) return (amount / 1e12).toFixed(2) + "𝗧";
  if (amount >= 1e9) return (amount / 1e9).toFixed(2) + "𝗕";
  if (amount >= 1e6) return (amount / 1e6).toFixed(2) + "𝐌";
  if (amount >= 1e3) return (amount / 1e3).toFixed(2) + "𝗞";
  return amount.toString();
}
