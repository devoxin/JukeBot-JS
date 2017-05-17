exports.run = function (client, msg, args) {

	if (!client.voiceConnections.get(msg.channel.guild.id) || !guilds[msg.channel.guild.id].queue[0]) return msg.channel.createMessage({ embed: {
		color: config.options.embedColour,
		title: "There's no playback activity."
	}});

	if (!permissions.isAdmin(msg.member) && guilds[msg.channel.guild.id].queue[0].req !== msg.author.id) return msg.channel.createMessage({ embed: {
		color: config.options.embedColour,
		title: "Insufficient Permissions",
	}});

	client.voiceConnections.get(msg.channel.guild.id).stopPlaying();

}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Skips the current song by force (no voting)"
};
