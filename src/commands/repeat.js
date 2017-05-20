exports.run = function (client, msg, args) {

	if (!permissions.isAdmin(msg.member))
		return msg.channel.createMessage({ embed: {
			color: config.options.embedColour,
			title: "Insufficient Permissions",
		}});

	if (!args[0])
		return msg.channel.createMessage({ embed: {
			color: config.options.embedColour,
			title: `Repeat mode: ${guilds[msg.channel.guild.id].repeat}`,
			description: `${prefixes[msg.channel.guild.id]}repeat < a | c | n >\n\n[All, Current, None]`
		}});

	if (!(args[0] === "a" || args[0] === "c" || args[0] === "n"))
		return msg.channel.createMessage({ embed: {
			color: config.options.embedColour,
			title: `Repeat mode can only be set to 'a', 'c' or 'n'`,
			description: `[All, Current, None]`
		}});

	if 		(args[0] === "a")  guilds[msg.channel.guild.id].repeat = "All";
	else if (args[0] === "c")  guilds[msg.channel.guild.id].repeat = "Current";
	else if	(args[0] === "n")  guilds[msg.channel.guild.id].repeat = "None";

	msg.channel.createMessage({ embed: {
		color: config.options.embedColour,
		title: "Repeat Toggled",
		description: `Repeating ${guilds[msg.channel.guild.id].repeat}`
	}});

}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Toggles the repeat mode (All -> Current -> None)"
};
