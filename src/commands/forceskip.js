exports.run = function (client, msg, args) {

	if (!permissions.isAdmin(msg.member) && guilds[msg.channel.guild.id].queue[0].req !== msg.author.id) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "Insufficient Permissions",
	}});

	if (!client.voiceConnections.get(msg.channel.guild.id)) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "There's no playback activity."
	}});

	client.voiceConnections.get(msg.channel.guild.id).stopPlaying();

}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Skips the current song by force (no voting)"
};
