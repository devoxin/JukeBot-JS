exports.run = function (client, msg, args, guilds) {

	if (!permissions.isAdmin(msg.member, msg.guild.id, db)) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "Insufficient Permissions",
	}});

	if (!client.voiceConnections.get(msg.guild.id)) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "There's no playback activity."
	}});

	client.voiceConnections.get(msg.guild.id).pause();

}

exports.usage = {
	main: "{prefix}{command}",
	args: ""
};
