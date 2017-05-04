const fs = require("fs");

exports.run = function(client, msg, args) {
	if (msg.author.id !== "180093157554388993" && msg.author.id !== "284122164582416385") return;
	fs.writeFile("./prefixes.json", JSON.stringify(prefixes, "", "\t"), (err) => {
		if (err) console.log("Failed to update prefixes.");

		msg.channel.createMessage(":gear: Now restarting...").then(() => {
			process.exit();
		})
	});
}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Developer command"
}
