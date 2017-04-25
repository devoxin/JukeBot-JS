exports.run = function (client, msg, args, db) {

	if (!permissions.isAdmin(msg.member, msg.channel.guild.id, db)) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "Insufficient Permissions",
	}});

	let guild = guilds[msg.channel.guild.id];

	if 		(guild.repeat === "All") 	  guild.repeat = "Current";
	else if (guild.repeat === "Current")  guild.repeat = "None";
	else if (guild.repeat === "None") 	  guild.repeat = "All";

	msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "Repeat Toggled",
		description: `Repeating ${guild.repeat}`
	}});

}

exports.usage = {
	main: "{prefix}{command}",
	args: "[ Repeat the command to cycle modes ]"
};
