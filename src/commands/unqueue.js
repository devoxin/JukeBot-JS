exports.run = function(client, msg, args) {

	if (guilds[msg.channel.guild.id].queue.length <= 1) return msg.channel.createMessage({ embed: {
		color: config.options.embedColour,
		title: "The queue is empty."
	}});

	if (!parseInt(args[0]) || args[0] <= 0|| args[0] >= guilds[msg.channel.guild.id].queue.length) return msg.channel.createMessage({ embed: {
		color: config.options.embedColour,
		title: `You need to specify a number higher than 0, and less than ${guilds[msg.channel.guild.id].queue.length}`
	}});

	if (guilds[msg.channel.guild.id].queue[Math.round(args[0])].req !== msg.author.id && !permissions.isAdmin(msg.member))
		return msg.channel.createMessage({ embed: {
			color: config.options.embedColour,
			title: "You can't unqueue that."
		}});

	msg.channel.createMessage({ embed: {
		color: config.options.embedColour,
		title: `Unqueued ${guilds[msg.channel.guild.id].queue[args[0]].title}`
	}});

	guilds[msg.channel.guild.id].queue.splice(args[0], 1);
};

exports.usage = {
	main: "{prefix}{command}",
	args: "<index>",
	description: "Unqueues the song at the specified position"
};
