const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "file",
        aliases: ["files"],
        version: "1.1",
        author: "Arijit",
        countDown: 5,
        role: 0,
        shortDescription: "Send bot script",
        longDescription: "Send a specified bot file",
        category: "OWNER",
        guide: "{pn} <filename> — Example: {pn} index"
    },

    onStart: async function ({ args, api, event }) {
        const permission = ["100069254151118"];
        if (!permission.includes(event.senderID)) {
            return api.sendMessage(
                "❌ You don't have permission to use this command.",
                event.threadID,
                event.messageID
            );
        }

        if (!args[0]) {
            return api.sendMessage(
                "⚠ Please provide a file name.\nExample: file index",
                event.threadID,
                event.messageID
            );
        }

        const filePath = path.join(__dirname, ${args[0]}.js);

        if (!fs.existsSync(filePath)) {
            return api.sendMessage(
                ❌ File not found: ${args[0]}.js,
                event.threadID,
                event.messageID
            );
        }

        try {
            api.sendMessage(
                {
                    body: 📄 Sending file: ${args[0]}.js,
                    attachment: fs.createReadStream(filePath)
                },
                event.threadID,
                event.messageID
            );
        } catch (err) {
            api.sendMessage(
                ⚠ Error reading file: ${err.message},
                event.threadID,
                event.messageID
            );
        }
    }
};
