exports.run = function (client, msg, args) {

	if (!permissions.isAdmin(msg.member)) return msg.channel.createMessage({ embed: {
		color: config.options.embedColour,
		title: "Insufficient Permissions",
	}});

	if (!client.voiceConnections.get(msg.channel.guild.id) || guilds[msg.channel.guild.id].queue.length === 0) return msg.channel.createMessage({ embed: {
		color: config.options.embedColour,
		title: "There's no playback activity."
	}});

	client.voiceConnections.get(msg.channel.guild.id).resume();

}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Resume playback of the current song if it was paused"
};
