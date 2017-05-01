exports.run = async function (client, msg, args, db) {

	if (!permissions.isAdmin(msg.member, msg.channel.guild.id, db)) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "Insufficient Permissions",
	}});

	if (!args[0]) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "Specify a user"
	}});

	let usr = isNaN(args.join(" ")) ? msg.channel.guild.members.filter(u => u.username.toLowerCase().includes(args.join(" ").toLowerCase())) : msg.channel.guild.members.get(args.join(" "));
	console.log(usr);
	if (typeof usr === Array && usr[0]) usr = usr[0];
	console.log(usr);
	if (!usr) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "No users found matching the specified name"
	}});
	await rethonk.db("data").table("guilds").update({ id: msg.channel.guild.id, admins: db.admins.filter(id => id !== usr.id) }).run()
	.catch(err => {
		return msg.channel.createMessage({	embed: {
			color: 0x1E90FF,
			title: "Failed to update admins",
			description: err.message
		}});
	});

	console.log(usr);
	msg.channel.createMessage({	embed: {
		color: 0x1E90FF,
		title: `Removed ${usr.username}#${usr.discriminator} from admins.`
	}});

}

exports.usage = {
	main: "{prefix}{command}",
	args: "<@mention>"
};
