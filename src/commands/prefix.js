const permissions = require("../../util/Permissions.js");
const fs          = require("fs");

exports.run = function (client, msg, args, guilds) {

	if (!permissions.isAdmin(msg.member, msg.guild.id)) return msg.channel.createMessage({
		embed: {
			color: 0x1E90FF,
			title: "Insufficient Permissions",
		}
	});

	if (!args[0]) return msg.channel.createMessage({
		embed: {
			color: 0x1E90FF,
			title: "Invalid prefix character"
		}
	});

	let rewrite = require(`../data/${msg.guild.id}.json`);
	delete require.cache[`../data/${msg.guild.id}.json`];

	guilds[msg.guild.id].prefix = args[0];
	rewrite.prefix = args[0];

	fs.writeFileSync(`./data/${msg.guild.id}.json`, JSON.stringify(rewrite, "", "\t"))

}

exports.usage = {
	main: "{prefix}{command}",
	args: "<prefix>"
};
