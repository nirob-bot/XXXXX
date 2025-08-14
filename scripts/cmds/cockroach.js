const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const Jimp = require("jimp");

module.exports = {
  config: {
    name: "cockroach",
    version: "1.1.0",
    author: "Arafat & Arijit",
    countDown: 5,
    role: 0,
    shortDescription: "Expose someone as a cockroach!",
    longDescription: "Puts the tagged/replied user's face on a cockroach's body (funny meme)",
    category: "fun",
    guide: {
      en: "{pn} @mention or reply to cockroach someone",
    },
  },

  onStart: async function ({ event, message, api }) {
    let targetID = Object.keys(event.mentions)[0];
    if (event.type === "message_reply") {
      targetID = event.messageReply.senderID;
    }

    if (!targetID) {
      return message.reply("❗ কাউকে ট্যাগ কর বা রিপ্লাই দে, যাতে ওরে তেলাপোকা বানানো যায়!");
    }

    if (targetID === event.senderID) {
      return message.reply("❗ নিজেকে তেলাপোকা বানাতে চাস? একটু লজ্জা কর ভাই! 😹");
    }

    const baseFolder = path.join(__dirname, "Arafat_Temp");
    const bgPath = path.join(baseFolder, "cockroach.png");
    const avatarPath = path.join(baseFolder, `avatar_${targetID}.png`);
    const outputPath = path.join(baseFolder, `cockroach_result_${targetID}.png`);

    try {
      if (!fs.existsSync(baseFolder)) fs.ensureDirSync(baseFolder);

      // Download cockroach template if missing
      if (!fs.existsSync(bgPath)) {
        const imgUrl = "https://raw.githubusercontent.com/Arafat-Core/Arafat-Temp/main/cockroach.png";
        const res = await axios.get(imgUrl, { responseType: "arraybuffer" });
        await fs.writeFile(bgPath, res.data);
      }

      // Fetch user avatar
      let avatarBuffer;
      try {
        const userInfo = await api.getUserInfo(targetID);
        const avatarUrl = userInfo[targetID]?.profileUrl || userInfo[targetID]?.profile_pic;
        if (!avatarUrl) throw new Error("No avatar URL found");

        avatarBuffer = (await axios.get(avatarUrl, { responseType: "arraybuffer" })).data;
        await fs.writeFile(avatarPath, avatarBuffer);
      } catch (err) {
        console.error("Avatar fetch failed, using default:", err);
        const defaultAvatarPath = path.join(__dirname, "default_avatar.png");
        if (!fs.existsSync(defaultAvatarPath)) {
          throw new Error("Default avatar missing!");
        }
        avatarBuffer = fs.readFileSync(defaultAvatarPath);
        await fs.writeFile(avatarPath, avatarBuffer);
      }

      // Process avatar image
      const avatarImg = await Jimp.read(avatarPath);
      avatarImg.circle();
      await avatarImg.writeAsync(avatarPath);

      const bg = await Jimp.read(bgPath);
      bg.resize(600, 800);

      const avatarCircle = await Jimp.read(avatarPath);
      avatarCircle.resize(100, 100);

      // Positioning face on cockroach's head
      const xCenter = (bg.getWidth() - avatarCircle.getWidth()) / 2;
      const yTop = 290;

      bg.composite(avatarCircle, xCenter, yTop);

      const finalBuffer = await bg.getBufferAsync(Jimp.MIME_PNG);
      await fs.writeFile(outputPath, finalBuffer);

      const userInfo = await api.getUserInfo(targetID);
      const tagName = userInfo[targetID]?.name || "Someone";

      await message.reply(
        {
          body: `🪳\n${tagName} হলো একটা আসল তেলাপোকা!`,
          mentions: [{ tag: tagName, id: targetID }],
          attachment: fs.createReadStream(outputPath),
        },
        () => {
          try { fs.unlinkSync(avatarPath); } catch {}
          try { fs.unlinkSync(outputPath); } catch {}
        }
      );

    } catch (err) {
      console.error("🐞 Cockroach Command Error:", err);
      message.reply("ওপ্পস! তেলাপোকা পালাইছে বোধহয়... আবার চেষ্টা কর।");
    }
  },
};
