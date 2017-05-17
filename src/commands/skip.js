exports.run = function (client, msg, args) {

	if (!client.voiceConnections.get(msg.channel.guild.id) || !client.voiceConnections.get(msg.channel.guild.id).channelID)	return msg.channel.createMessage({ embed: {
		color: config.options.embedColour,
		title: "There's no playback activity"
	}});

	if (msg.member.voiceState.channelID !== client.voiceConnections.get(msg.channel.guild.id).channelID)
		return msg.channel.createMessage({ embed: {
			color: config.options.embedColour,
			title: "You need to be in my voicechannel to skip"
		}});

	if (guilds[msg.channel.guild.id].svotes.includes(msg.author.id))
		return msg.channel.createMessage({ embed: {
			color: config.options.embedColour,
			title: "You've already voted"
		}});

	guilds[msg.channel.guild.id].svotes.push(msg.author.id);

	let voiceMembers = Math.round(msg.channel.guild.channels.get(msg.member.voiceState.channelID).voiceMembers.filter(m => !m.bot).length / 2);

	if (guilds[msg.channel.guild.id].svotes.length >= voiceMembers)
		return client.voiceConnections.get(msg.channel.guild.id).stopPlaying();

	msg.channel.createMessage({ embed: {
		color: config.options.embedColour,
		title: "Voted to skip",
		description: `${guilds[msg.channel.guild.id].svotes.length}/${voiceMembers} vote(s) needed.`
	}});
}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Vote skip the currently playing song"
};
