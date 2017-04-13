const permissions = require("../../util/Permissions.js");

exports.run = async function (client, msg, args, guilds) {

	if (!permissions.isAdmin(msg.member, msg.guild.id)) return msg.channel.createMessage({
		embed: {
			color: 0x1E90FF,
			title: "Insufficient Permissions",
		}
	})

	let m = await msg.channel.createMessage({
		embed: {
			color: 0x1E90FF,
			title: "Resetting voice..."
		}
	})

	if (client.voiceConnections.get(msg.guild.id) && client.voiceConnections.get(msg.guild.id).channelID)
		client.leaveVoiceChannel(client.voiceConnections.get(msg.guild.id).channelID);

	guilds[msg.guild.id].queue = [];

	m.edit({
		embed: {
			color: 0x1E90FF,
			title: "Voice Reset.",
			description: "Any further issues please report [here](https://discord.gg/xvtH2Yn)"
		}
	})

}

exports.usage = {
	main: "{prefix}{command}",
	args: ""
};
