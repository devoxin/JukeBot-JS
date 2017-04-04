const permissions = require("../../util/Permissions.js");
const fs          = require("fs");

exports.run = function (client, msg, args, guilds) {

	if (!permissions.isAdmin(msg.member, msg.guild.id)) return msg.channel.createMessage({
		embed: {
			color: 0x1E90FF,
			title: "Insufficient Permissions",
		}
	})

	if (msg.mentions.length === 0) return msg.channel.createMessage({
		embed: {
			color: 0x1E90FF,
			title: "Specify at least one user"
		}
	})

	let rewrite = require(`../data/${msg.guild.id}.json`);
	delete require.cache[`../data/${msg.guild.id}.json`];

	msg.mentions.map(u => {
		if (rewrite.blocked.indexOf(u.id) === -1 && !rewrite.admins.includes(u.id))
			rewrite.blocked.push(u.id);
	})

	fs.writeFileSync(`./data/${msg.guild.id}.json`, JSON.stringify(rewrite, "", "\t"))

	msg.channel.createMessage({
		embed: {
			color: 0x1E90FF,
			title: "Blacklist Updated."
		}
	})
}
