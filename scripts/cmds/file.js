const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "file",
    aliases: ["files"],
    version: "1.1",
    author: "NIrob",
    countDown: 5,
    role: 0,
    shortDescription: "Send bot script file",
    longDescription: "Send a specified bot file as an attachment",
    category: "𝗢𝗪𝗡𝗘𝗥",
    guide: "{pn} filename (without .js)"
  },

  onStart: async function ({ message, args, api, event }) {
    const permission = ["100069254151118"];
    if (!permission.includes(event.senderID)) {
      return api.sendMessage(
        "You don't have permission to use this command. 🐤",
        event.threadID,
        event.messageID
      );
    }

    const fileName = args[0];
    if (!fileName) {
      return api.sendMessage(
        "Please provide a file name. Example: file example",
        event.threadID,
        event.messageID
      );
    }

    const filePath = path.join(__dirname, `${fileName}.js`);

    if (!fs.existsSync(filePath)) {
      return api.sendMessage(
        `File not found: ${fileName}.js`,
        event.threadID,
        event.messageID
      );
    }

    // Send the file as an attachment
    api.sendMessage(
      {
        body: `Here is the file: ${fileName}.js`,
        attachment: fs.createReadStream(filePath)
      },
      event.threadID,
      event.messageID
    );
  }
};
