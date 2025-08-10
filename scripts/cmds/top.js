module.exports = {
  config: {
    name: "top",
    version: "1.4",
    author: "SAIF x gpt🤡",
    role: 0,
    shortDescription: {
      en: "Top 15 Rich Users"
    },
    longDescription: {
      en: ""
    },
    category: "group",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message, usersData }) {
    try {
      // Get all users from database
      const allUsers = await usersData.getAll();

      if (!allUsers || allUsers.length === 0) {
        return message.reply("No user data found.");
      }

      // Sort users by money and take top 15
      const topUsers = allUsers
        .sort((a, b) => (b.money || 0) - (a.money || 0))
        .slice(0, 15);

      // Function to format numbers
      function formatNumber(num) {
        if (num >= 1e15) return (num / 1e15).toFixed(2) + "Q";
        if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
        if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
        if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
        if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
        return num.toString();
      }

      const medals = ["🥇", "🥈", "🥉"];

      // Create leaderboard
      const topUsersList = topUsers.map((user, index) => {
        const moneyFormatted = formatNumber(user.money || 0);
        const rankSymbol = medals[index] || `${index + 1}.`;
        return `${rankSymbol} ${user.name || "Unknown"} - ${moneyFormatted}`;
      });

      // Build final message
      const messageText =
        `👑 𝗧𝗢𝗣 𝗥𝗜𝗖𝗛𝗘𝗦𝗧 𝗨𝗦𝗘𝗥𝗦 👑\n` +
        `━━━━━━━━━━━\n` +
        topUsersList.join("\n");

      message.reply(messageText);

    } catch (error) {
      console.error(error);
      message.reply("An error occurred while fetching the top users.");
    }
  }
};
