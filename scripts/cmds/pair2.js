const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require("path");

module.exports = {
  config: {
    name: "pair2",
    author: "Nyx x Ariyan + Arijit",
    category: "TOOLS"
  },

  onStart: async function ({ api, event, usersData }) {
    try {
      const senderData = await usersData.get(event.senderID);
      const senderName = senderData.name || "Unknown User";

      const threadData = await api.getThreadInfo(event.threadID);
      const users = threadData.userInfo;

      const myData = users.find(user => user.id === event.senderID);
      if (!myData || !myData.gender) {
        return api.sendMessage("❌ Your gender is not set, cannot find a match.", event.threadID, event.messageID);
      }

      const myGender = myData.gender;
      let matchCandidates = [];

      if (myGender === "MALE") {
        matchCandidates = users.filter(user => user.gender === "FEMALE" && user.id !== event.senderID);
      } else if (myGender === "FEMALE") {
        matchCandidates = users.filter(user => user.gender === "MALE" && user.id !== event.senderID);
      } else {
        return api.sendMessage("❌ Undefined gender, cannot find match.", event.threadID, event.messageID);
      }

      if (matchCandidates.length === 0) {
        return api.sendMessage("😔 No suitable match found in this group.", event.threadID, event.messageID);
      }

      const selectedMatch = matchCandidates[Math.floor(Math.random() * matchCandidates.length)];
      const matchName = selectedMatch.name || "Unknown Match";
      const lovePercentage = Math.floor(Math.random() * 100) + 1;

      // Canvas setup
      const width = 800, height = 400;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');

      const background = await loadImage("https://i.postimg.cc/tRFY2HBm/0602f6fd6933805cf417774fdfab157e.jpg");

      // Fetch avatars
      const senderAvatarURL = await usersData.getAvatarUrl ? await usersData.getAvatarUrl(event.senderID) : `https://graph.facebook.com/${event.senderID}/picture?width=512&height=512`;
      const matchAvatarURL = await usersData.getAvatarUrl ? await usersData.getAvatarUrl(selectedMatch.id) : `https://graph.facebook.com/${selectedMatch.id}/picture?width=512&height=512`;

      const senderAvatar = await loadImage(senderAvatarURL);
      const matchAvatar = await loadImage(matchAvatarURL);

      ctx.drawImage(background, 0, 0, width, height);
      ctx.drawImage(senderAvatar, 100, 100, 200, 200);
      ctx.drawImage(matchAvatar, 500, 100, 200, 200);

      // Save image
      const outputPath = path.join(__dirname, 'pair_output.png');
      const out = fs.createWriteStream(outputPath);
      const stream = canvas.createPNGStream();
      stream.pipe(out);

      out.on('finish', () => {
        const message = `🥰 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹 𝗣𝗮𝗶𝗿𝗶𝗻𝗴 💕
🎀 ${senderName}
🎀 ${matchName}
💌 Wishing you two a lifetime of happiness ❤️
💙 Love Percentage: ${lovePercentage}%`;

        api.sendMessage({
          body: message,
          attachment: fs.createReadStream(outputPath)
        }, event.threadID, () => fs.unlinkSync(outputPath), event.messageID);
      });

    } catch (error) {
      console.error(error);
      return api.sendMessage("❌ An error occurred: " + error.message, event.threadID, event.messageID);
    }
  }
};
