exports.run = function (client, msg, args) {

	if (!permissions.isAdmin(msg.member)) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "Insufficient Permissions",
	}});

	if (!client.voiceConnections.get(msg.channel.guild.id) || guilds[msg.channel.guild.id].queue.length === 0) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "There's no playback activity."
	}});

	client.voiceConnections.get(msg.channel.guild.id).pause();

}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Pause playback"
};
