const sf   = require("snekfetch");
const bash = require("child_process");

exports.run = async function(client, msg, args) {
	if (msg.author.id !== "180093157554388993") return msg.channel.createMessage({ embed: {
		color: config.options.embedColour,
		title: ":warning: Restricted Command",
		description: "This command is locked to the developer only."
	}});

	if (!args[0]) return msg.channel.createMessage("No arguments passed");

	let m = await msg.channel.createMessage("❯_ " + args.join(" "));
	bash.exec(`${args.join(" ")}`, async (e, stdout, stderr) => {
		if (e) return m.edit(`\`\`\`js\n${e.message}\n\`\`\``);
		if (stdout.length > 2000 || stderr.length > 2000) {
			let toPost = "INFO:\n" + stdout + "\n\nERRORS:\n" + stderr
			let s = await superagent.post("https://hastebin.com/documents")
			.send(toPost)
			.catch(err => m.edit("Failed to post bash output:\n" + err.message));

			if (!s || !s.body) m.edit("Server returned null.");
			m.edit(`❯_ ${args.join(" ")}\nOutput too big, view at https://hastebin.com/${s.body.key}`)
		} else {
			if (!stdout && !stderr) return m.addReaction("\u2611")
			stdout && msg.channel.createMessage("**Info**\n" + (stdout !== "" ? "```js\n" + stdout + "```" : "No information."));
			stderr && msg.channel.createMessage("**Errors**\n" + (stderr !== "" ? "```js\n" + stderr + "```" : "No errors."));
		};
	});
}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Developer command"
};
