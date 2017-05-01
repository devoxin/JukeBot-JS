exports.run = async function (client, msg, args, db) {

	if (!permissions.isAdmin(msg.member, msg.channel.guild.id, db)) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "Insufficient Permissions",
	}});

	if (!args[0]) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "Specify a user name, ID or mention."
	}});

	let usr;
	if (msg.mentions.length > 0) usr = msg.mentions[0];
	else if (isNaN(args.join(" "))) usr = msg.channel.guild.members.filter(u => u.username.toLowerCase().includes(args.join(" ").toLowerCase()));
	else usr = msg.channel.guild.members.get(args.join(" "));

	if (!usr) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "No users found matching the specified name"
	}});

	if (usr[0]) usr = usr[0].user;
	else if (usr.user) usr = usr.user;

	if (db.admins.indexOf(usr.id) === -1 && !db.blocked.includes(usr.id)) db.admins.push(usr.id);

	await rethonk.db("data").table("guilds").update({ id: msg.channel.guild.id, admins: db.admins }).run()
	.catch(err => {
		msg.channel.createMessage({	embed: {
			color: 0x1E90FF,
			title: "Failed to update admins",
			description: err.message
		}});
	});

	msg.channel.createMessage({	embed: {
		color: 0x1E90FF,
		title: `Added ${usr.username}#${usr.discriminator} to admins.`
	}});

}

exports.usage = {
	main: "{prefix}{command}",
	args: "< ID | Username | @Mention >"
};
