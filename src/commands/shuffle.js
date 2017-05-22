exports.run = function (client, msg, args) {

	if (!permissions.isAdmin(msg.member))
		return msg.channel.createMessage({ embed: {
			color: config.options.embedColour,
			title: "Insufficient Permissions",
		}});

	if (!client.voiceConnections.get(msg.channel.guild.id))
		return msg.channel.createMessage({ embed: {
			color: config.options.embedColour,
			title: "There's no playback activity"
		}});

	if (guilds[msg.channel.guild.id].queue.length < 3)
		return msg.channel.createMessage({ embed: {
			color: config.options.embedColour,
			title: "There's not enough songs in the queue to shuffle",
		}});

	let tempqueue = guilds[msg.channel.guild.id].queue.slice(1);
	let curInd = tempqueue.length, tempVal, randInd;

	while (curInd !== 0) {

		randInd = Math.floor(Math.random() * curInd);
		curInd --;
		tempVal = tempqueue[curInd];
		tempqueue[curInd] = tempqueue[randInd];
		tempqueue[randInd] = tempVal;

	};

	tempqueue.splice(0, 0, guilds[msg.channel.guild.id].queue[0])
	guilds[msg.channel.guild.id].queue = tempqueue;

	msg.channel.createMessage({ embed: {
		color: config.options.embedColour,
		title: "Queue Shuffled."
	}});

}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Randomizes the queue"
};
