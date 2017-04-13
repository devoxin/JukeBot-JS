exports.run = function (client, msg, args, guilds) {
	if (guilds[msg.guild.id].queue.length === 0)
		return msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: "Nothing is queued."
		}})
	let song = guilds[msg.guild.id].queue[0]
	msg.author.getDMChannel().then(channel => {
		channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: song.title,
			url  : `https://youtu.be/${song.id}`
		}})
	})
}

exports.usage = {
	main: "{prefix}{command}",
	args: ""
};
