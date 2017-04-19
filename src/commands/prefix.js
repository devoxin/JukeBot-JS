exports.run = function (client, msg, args, guilds, db) {

	if (!permissions.isAdmin(msg.member, msg.guild.id)) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "Insufficient Permissions",
	}});

	if (!args[0]) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "Invalid prefix character"
	}});

	rethonk.db("data").table("guilds").update({ id: msg.guild.id, prefix: args[0] }).run()
	.then(() => {
		msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: "Prefix updated."
		}});
	})
	.catch(err => {
		msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: "Failed to update prefix."
		}});
	});

}

exports.usage = {
	main: "{prefix}{command}",
	args: "<prefix>"
};
