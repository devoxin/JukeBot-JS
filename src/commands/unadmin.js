exports.run = function (client, msg, args, db) {

	if (!permissions.isAdmin(msg.member, msg.channel.guild.id, db)) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "Insufficient Permissions",
	}});

	if (!args[0]) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "Specify a user"
	}});

	let usr = msg.channel.guild.members.filter(u => u.username.toLowerCase().includes(args.join(" ").toLowerCase()));
	if (usr.length === 0) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "No users found matching the specified name"
	}});

	rethonk.db("data").table("guilds").update({ id: msg.channel.guild.id, admins: db.admins.filter(id => !db.admins.includes(usr[0].id)) }).run()
	.then(() => {
		msg.channel.createMessage({	embed: {
			color: 0x1E90FF,
			title: `Removed ${usr[0].username}#${usr[0].discriminator} from admins.`
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
