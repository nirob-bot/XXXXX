function formatAmount(num) {
  const suffixes = ["", "K", "M", "B", "T", "Q", "QQ", "S"];
  const tier = Math.floor(Math.log10(num) / 3);

  if (tier === 0) return "$" + num.toString();

  const suffix = suffixes[tier] || "";
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;

  return "$" + scaled.toFixed(2).replace(/\.00$/, "") + suffix;
}

module.exports = {
  config: {
    name: "setmall",
    aliases: ["setallmoney", "setmoneyall"],
    version: "1.4",
    author: "Arijit",
    countDown: 5,
    role: 2, // Admin only
    shortDescription: "Set balance for all users",
    longDescription: "Update all users' balances (including yourself) to the same amount.",
    category: "💰 Banking",
    guide: {
      en: "{pn} <amount>\nExample: {pn} 1000000"
    }
  },

  onStart: async function ({ api, event, args, usersData, message }) {
    const amount = parseInt(args[0]);

    if (!args[0] || isNaN(amount) || amount < 0) {
      return message.reply(
        "❌ | **Invalid Amount**\n" +
        "Please enter a valid positive number.\n\n" +
        "💡 Example:\n`!setmall 1000000`"
      );
    }

    try {
      let allUsers = await usersData.getAll();
      const senderID = event.senderID;

      // Add sender if not in list
      if (!allUsers.find(u => u.userID === senderID)) {
        allUsers.push({ userID: senderID });
      }

      let count = 0;
      for (const user of allUsers) {
        if (user.userID) {
          await usersData.set(user.userID, amount, "money");
          count++;
        }
      }

      const formatted = formatAmount(amount);

      return message.reply(
        "╔══════════════════╗\n" +
        "💰 **Balance Update Complete** 💰\n" +
        "╚══════════════════╝\n" +
        `✅ Updated: **${count} users**\n` +
        `💵 New Balance: **${formatted}**\n` +
        "━━━━━━━━━━━━━━━━━━━\n" +
        `👑 Command used by: ${event.senderID}`
      );

    } catch (err) {
      console.error("Error in setmall command:", err);
      return message.reply("❌ | Something went wrong while updating balances. Please check the console for details.");
    }
  }
};
