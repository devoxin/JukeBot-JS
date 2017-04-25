exports.run = function(client, msg, args, db) {

	if (guilds[msg.channel.guild.id].queue.length <= 1) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "The queue is empty."
	}});

	if (!parseInt(args[0]) || args[0] <= 1 || args[0] >= guilds[msg.channel.guild.id].queue.length) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: `You need to specify a number higher than 1, and less than ${guilds[msg.channel.guild.id].queue.length}`
	}});

	if (guilds[msg.channel.guild.id].queue[Math.round(args[0])].req !== msg.author.id && permissions.isAdmin(msg.member.id, msg.channel.guild.id, db))
		return msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: "You can't unqueue that."
		}});

	msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: `Unqueued ${guilds[msg.channel.guild.id].queue[args[0]].title}`
	}});

	guilds[msg.channel.guild.id].queue.splice(args[0], 1);
};

exports.usage = {
	main: "{prefix}{command}",
	args: "<index>"
};
