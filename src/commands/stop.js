exports.run = function (client, msg, args) {

	if (!permissions.isAdmin(msg.member)) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "Insufficient Permissions",
	}});

	if (!client.voiceConnections.get(msg.channel.guild.id)) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "There's no playback activity."
	}});

	guilds[msg.channel.guild.id].repeat = "None";
	guilds[msg.channel.guild.id].queue.splice(1, guilds[msg.channel.guild.id].queue.length);
	client.voiceConnections.get(msg.channel.guild.id).stopPlaying();

}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Clears the queue and halts playback"
};
