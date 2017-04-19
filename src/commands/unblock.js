exports.run = function (client, msg, args, guilds, db) {

	if (!permissions.isAdmin(msg.member, msg.guild.id, db)) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "Insufficient Permissions",
	}});

	if (msg.mentions.length === 0) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "Specify at least one user"
	}});

	let ids = msg.mentions.map(u => u.id);
	
	rethonk.db("data").table("guilds").update({ id: msg.guild.id, blocked: db.blocked.filter(id => !ids.includes(id)) }).run()
	.then(() => {
		msg.channel.createMessage({	embed: {
			color: 0x1E90FF,
			title: "Blacklist updated."
		}});
	})
	.catch(err => {
		msg.channel.createMessage({	embed: {
			color: 0x1E90FF,
			title: "Failed to update blacklist",
			description: err.message
		}});
	});

}

exports.usage = {
	main: "{prefix}{command}",
	args: "<@mention>"
};
