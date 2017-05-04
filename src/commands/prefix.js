exports.run = function (client, msg, args) {

	if (!permissions.isAdmin(msg.member, msg.channel.guild.id)) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "Insufficient Permissions",
	}});

	if (!args[0]) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "Invalid prefix character"
	}});

	prefixes[msg.channel.guild.id] = args[0];

	msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "Prefix updated!"
	}})

}

exports.usage = {
	main: "{prefix}{command}",
	args: "<prefix>",
	description: "Sets the prefix for this server"
};
