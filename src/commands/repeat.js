exports.run = function (client, msg, args) {

	if (!permissions.isAdmin(msg.member)) return msg.channel.createMessage({ embed: {
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
	args: "",
	description: "Toggles the repeat mode (All -> Current -> None)"
};
