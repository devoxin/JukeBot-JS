exports.run = async function(client, msg, args) {

	if (guilds[msg.channel.guild.id].queue.length <= 1) return msg.channel.createMessage({ embed: {
		color: config.options.embedColour,
		title: "The queue is empty."
	}});

	if (!parseInt(args[0]) || args[0] === 0) return msg.channel.createMessage({ embed: {
		color: config.options.embedColour,
		title: "You need to specify a number between 1 and 100"
	}});

	let queue = guilds[msg.channel.guild.id].queue.slice(1);

	let remove = parseInt(args[0]) ? parseInt(args[0]) : 1
	let removed = 0;
	let qi = queue.length - 1;

	let m = await msg.channel.createMessage({ embed: {
		color: config.options.embedColour,
		title: `Removing up to ${remove} songs queued by you...`
	}});

	for (let i = qi; i > -1; i--) {
		if (removed === remove) break;

		if (queue[i].req === msg.author.id) {
			queue.splice(i, 1)
			removed++;
		}
	}

	queue.splice(0, 0, guilds[msg.channel.guild.id].queue[0])
	guilds[msg.channel.guild.id].queue = queue;

	m.edit({ embed: {
		color: config.options.embedColour,
		title: `${removed} songs unqueued`
	}});
}

exports.usage = {
	main: "{prefix}{command}",
	args: "<1-100>",
	description: "Removes the last `x` songs from the queue"
};
