exports.run = function (client, msg, args, guilds, db) {

	if (!permissions.isAdmin(msg.member, msg.guild.id, db)) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "Insufficient Permissions",
	}});

	if (!args[0]) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "Specify a user"
	}});

	let usr = msg.guild.members.filter(u => u.username.toLowerCase().includes(args.join(" ").toLowerCase()));
	if (usr.length === 0) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "No users found matching the specified name"
	}});

	if (db.admins.indexOf(usr[0].id) === -1 && !db.blocked.includes(usr[0].id))
		db.admins.push(usr[0].id);

	rethonk.db("data").table("guilds").update({ id: msg.guild.id, admins: db.admins }).run()
	.then(() => {
		msg.channel.createMessage({	embed: {
			color: 0x1E90FF,
			title: `Added ${usr[0].username}#${usr[0].discriminator} to admins.`
		}});
	})
	.catch(err => {
		msg.channel.createMessage({	embed: {
			color: 0x1E90FF,
			title: "Failed to update admins",
			description: err.message
		}});
	});

}

exports.usage = {
	main: "{prefix}{command}",
	args: "<@mention>"
};
