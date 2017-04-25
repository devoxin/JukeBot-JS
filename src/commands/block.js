exports.run = function (client, msg, args, db) {

	if (!permissions.isAdmin(msg.member, msg.channel.guild.id, db)) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "Insufficient Permissions",
	}});

	if (msg.mentions.length === 0) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "Specify at least one user"
	}});

	msg.mentions.map(u => {
		if (db.blocked.indexOf(u.id) === -1 && !db.admins.includes(u.id))
			db.blocked.push(u.id);
	})

	rethonk.db("data").table("guilds").update({ id: msg.channel.guild.id, blocked: db.blocked }).run()
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
