exports.run = function (client, msg, args, guilds, db) {

	if (!permissions.isAdmin(msg.member, msg.guild.id, db)) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "Insufficient Permissions",
	}});

	if (!client.voiceConnections.get(msg.guild.id)) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "There's no playback activity."
	}});

	guilds[msg.guild.id].queue.splice(1, guilds[msg.guild.id].queue.length);
	client.voiceConnections.get(msg.guild.id).stopPlaying();

}

exports.usage = {
	main: "{prefix}{command}",
	args: ""
};
