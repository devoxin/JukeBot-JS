const permissions = require("../../util/Permissions.js");

exports.run = function (client, msg, args, guilds) {

	if (!permissions.isAdmin(msg.member, msg.guild.id)) return msg.channel.createMessage({
		embed: {
			color: 0x1E90FF,
			title: "Insufficient Permissions",
		}
	})

	if (!client.voiceConnections.get(msg.guild.id)) return msg.channel.createMessage({
		embed: {
			color: 0x1E90FF,
			title: "There's no playback activity."
		}
	})

	let tempqueue = guilds[msg.guild.id].queue.slice(1);
	let curInd = tempqueue.length, tempVal, randInd;

	while (curInd !== 0) {

		randInd = Math.floor(Math.random() * curInd);
		curInd --;
		tempVal = tempqueue[curInd];
		tempqueue[curInd] = tempqueue[randInd];
		tempqueue[randInd] = tempVal;

	}

	tempqueue.splice(0, 0, guilds[msg.guild.id].queue[0])
	guilds[msg.guild.id].queue = tempqueue;

	msg.channel.createMessage({
		embed: {
			color: 0x1E90FF,
			title: "Queue Shuffled."
		}
	})

}
