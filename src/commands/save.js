exports.run = function (client, msg, args) {

	if (guilds[msg.channel.guild.id].queue.length === 0)
		return msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: "Nothing is queued."
		}});

	let song = guilds[msg.channel.guild.id].queue[0];

	msg.author.getDMChannel().then(channel => {
		channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: song.title,
			url  : (song.src === "youtube" ? `https://youtu.be/${song.id}` : song.durl)
		}});
	});
}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "DMs you info about the currently playing song"
};
