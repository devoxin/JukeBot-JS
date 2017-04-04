const fs = require("fs");

exports.run = async function (client, msg, args, guilds) {

	let commands = await fs.readdirSync("./commands/");
	let aliases  = require(`../aliases.json`);
	delete require.cache[require.resolve(`../aliases.json`)];
	aliases = Object.keys(aliases).map(a => `${a}${pad(10, a)}${aliases[a]}`).join("\n")

	msg.channel.createMessage({
		embed: {
			color: 0x1E90FF,
			title: "Help",
			description: commands.map(c => c.replace(".js", "")).sort().join(", "),
			fields: [
				{ name: "Aliases", value: `\`\`\`\n${aliases}\n\`\`\``, inline: true },
				{ name: "Support", value: "Need help with JukeBot? [Join Here!](https://discord.gg/xvtH2Yn)", inline: true }
			]
		}
	})

}

function pad(ln, str) {
	return Array(ln - str.length).join(" ")
}
