exports.run = function (client, msg, args, db) {

	if (!permissions.isAdmin(msg.member, msg.channel.guild.id, db)) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "Insufficient Permissions",
	}});

	if (!msg.member.voiceState.channelID) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "You need to be in a voicechannel."
	}});

	if (!msg.channel.guild.channels.get(msg.member.voiceState.channelID).permissionsOf(client.user.id).has("voiceConnect") ||
		!msg.channel.guild.channels.get(msg.member.voiceState.channelID).permissionsOf(client.user.id).has("voiceSpeak"))
		return msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: "Unable to Connect",
			description: "This channel doesn't allow me to connect/speak."
		}});

	client.joinVoiceChannel(msg.member.voiceState.channelID);

}

exports.usage = {
	main: "{prefix}{command}",
	args: ""
};
