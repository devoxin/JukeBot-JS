const permissions = require("../../util/Permissions.js");

exports.run = function (client, msg, args, guilds) {

	if (!permissions.isAdmin(msg.member, msg.guild.id)) return msg.channel.createMessage({
		embed: {
			color: 0x1E90FF,
			title: "Insufficient Permissions",
		}
	});

	if (!client.voiceConnections.get(msg.guild.id)) return msg.channel.createMessage({
		embed: {
			color: 0x1E90FF,
			title: "There's no playback activity."
		}
	});

	if (!msg.member.voiceState.channelID) return msg.channel.createMessage({
		embed: {
			color: 0x1E90FF,
			title: "You need to be in a voicechannel."
		}
	});

	client.joinVoiceChannel(msg.member.voiceState.channelID)

}

exports.usage = {
	main: "{prefix}{command}",
	args: ""
};
