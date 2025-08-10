const fs = require('fs');
const path = require('path');

module.exports = {
	config: {
		name: "file",
		version: "1.0",
		author: "Mah MUD彡",
		countDown: 5,
		role: 0,
		shortDescription: "Send bot script",
		longDescription: "Send bot specified file",
		category: "admin",
		guide: "{pn} <file name>. Example: {pn} filename"
	},

	onStart: async function ({ message, args, api, event }) {
		// Allowed user IDs
		const permission = ["100069254151118"];
		if (!permission.includes(event.senderID)) {
			return api.sendMessage("❌ | 𝐒𝐨𝐫𝐫𝐲 𝐛𝐚𝐛𝐲, 𝐨𝐧𝐥𝐲 𝐌𝐚𝐡𝐌𝐔𝐃 𝐮𝐬𝐞 𝐭𝐡𝐢𝐬 𝐜𝐨𝐦𝐦𝐚𝐧𝐝", event.threadID, event.messageID);
		}

		// Check for file name argument
		const fileName = args[0];
		if (!fileName) {
			return api.sendMessage("⚠ | Please provide a file name. Example: file test", event.threadID, event.messageID);
		}

		// Build file path
		const filePath = path.join(__dirname, `${fileName}.js`);

		// Check if file exists
		if (!fs.existsSync(filePath)) {
			return api.sendMessage(`❌ | File not found: ${fileName}.js`, event.threadID, event.messageID);
		}

		// Read and send file content
		try {
			const fileContent = fs.readFileSync(filePath, 'utf8');
			api.sendMessage({ body: fileContent }, event.threadID, event.messageID);
		} catch (err) {
			api.sendMessage(`❌ | Error reading file: ${err.message}`, event.threadID, event.messageID);
		}
	}
};
