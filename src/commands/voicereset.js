exports.run = async function (client, msg, args) {

	if (!permissions.isAdmin(msg.member)) return msg.channel.createMessage({ embed: {
		color: config.options.embedColour,
		title: "Insufficient Permissions",
	}});

	let m = await msg.channel.createMessage({ embed: {
		color: config.options.embedColour,
		title: "Resetting voice..."
	}});

	if (client.voiceConnections.get(msg.channel.guild.id) && client.voiceConnections.get(msg.channel.guild.id).channelID)
		client.leaveVoiceChannel(client.voiceConnections.get(msg.channel.guild.id).channelID);

	guilds[msg.channel.guild.id].queue = [];

	m.edit({ embed: {
		color: config.options.embedColour,
		title: "Voice Reset.",
		description: "Any further issues please report [here](https://discord.gg/xvtH2Yn)"
	}});

}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Resets the voiceconnection if the bot is stuck"
};
