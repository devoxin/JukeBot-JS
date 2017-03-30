exports.run = function (client, msg, args, guilds) {
	let guild = guilds[msg.guild.id]
	if (!client.voiceConnections.get(msg.guild.id) || !client.voiceConnections.get(msg.guild.id).channelID)
		return msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: "There's no playback activity"
		}});

	if (msg.member.voiceState.channelID !== client.voiceConnections.get(msg.guild.id).channelID)
		return msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: "You need to be in my voicechannel to skip"
		}});

	if (guild.svotes.includes(msg.author.id))
		return msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: "You've already voted"
		}});

	guild.svotes.push(msg.author.id);

	let voiceMembers = Math.round(msg.guild.channels.get(msg.member.voiceState.channelID).voiceMembers.filter(m => !m.bot).length / 2)

	if (guild.svotes.length >= voiceMembers)
		return client.voiceConnections.get(msg.guild.id).stopPlaying();

	msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "Voted to skip",
		description: `${guild.svotes.length}/${voiceMembers} vote(s) needed.`
	}});
}
