exports.run = function (client, msg, args) {

	if (!config.prop.owners.includes(msg.author.id)) return false;

	if (!args[0]) return msg.channel.createMessage({embed: {
		color: config.options.embedColour,
		title: "Specify an action",
		description: "< farm | leave | find | black | member | inv >"
	}});

	if (args[0] === "farm") {
		if (!args[1]) return msg.channel.createMessage({ embed: {
			color: config.options.embedColour,
			title: "You need to specify a bot % threshold"
		}});

		let g = client.guilds.filter(g => g.members.filter(m => m.bot).length / g.members.size * 100 >= args[1])
		msg.channel.createMessage({ embed: {
			color: config.options.embedColour,
			title: `Matches Found (${g.length})`,
			fields: [
				{ name: "\u200B", value: (g.length > 0 ? g.slice(0, 10).map(s => `**${s.name}** (${s.id})`).join("\n") : "None"), inline: true }
			]
		}});

	};

	if (args[0] === "leave") {
		if (msg.author.id !== "180093157554388993") return;
		if (!args[1] || isNaN(args[1])) return msg.channel.createMessage({ embed: {
			color: config.options.embedColour,
			title: "You need to specify an ID"
		}});

		if (!client.guilds.get(args[1])) return msg.channel.createMessage({ embed: {
			color: config.options.embedColour,
			title: ":warning: Not found"
		}});

		client.guilds.get(args[1]).leave();

		msg.channel.createMessage({ embed: {
			color: config.options.embedColour,
			description: "Success."
		}});
	};

	if (args[0] === "inv") {
		if (!args[1]) return msg.channel.createMessage({ embed: {
			color: config.options.embedColour,
			title: "You need to specify a server ID"
		}});

		if (!client.guilds.get(args[1])) return msg.channel.createMessage({ embed: {
			color: config.options.embedColour,
			title: ":warning: Not found"
		}});

		client.guilds.get(args[1]).defaultChannel.createInvite({ maxAge: 15 }).then(inv => {
			msg.channel.createMessage("discord.gg/" + inv.code)
		}).catch(err => {
			msg.channel.createMessage("Failed to generate invite")
		});

	};

	if (args[0] === "member") {
		if (!args[1]) return msg.channel.createMessage({ embed: {
			color: config.options.embedColour,
			title: "You need to specify a member ID"
		}});

		let servers = client.guilds.filter(g => g.members.has(args[1]));
		msg.channel.createMessage({ embed: {
			color: config.options.embedColour,
			title: `Servers with member: ${args[1]}`,
			fields: [
				{ name: `${servers.length} results`, value: servers.map(s => s.name).join("\n"), inline: true }
			]
		}});

	};

	if (args[0] === "find") {
		if (!args[1]) return msg.channel.createMessage({ embed: {
			color: config.options.embedColour,
			title: "You need to specify a name or ID"
		}});

		if (isNaN(args[1])) {

			let search = client.guilds.filter(g => g.name.toLowerCase().includes(args.slice(1).join(" ").toLowerCase()))
			return msg.channel.createMessage({ embed: {
				color: config.options.embedColour,
				title: `Search Results (${search.length})`,
				fields: [
					{ name: "\u200B", value: (search.length > 0 ? search.slice(0, 10).map(s => `**${s.name}** (${s.id})`).join("\n") : "None"), inline: true }
				]
			}});

		} else {
			if (!client.guilds.get(args[1])) return msg.channel.createMessage({ embed: {
				color: config.options.embedColour,
				title: ":warning: Not found"
			}});

			let g = client.guilds.get(args[1])
			let bp = (g.members.filter(m => m.bot).length / g.members.size * 100).toFixed(2)
			msg.channel.createMessage({ embed: {
				color: config.options.embedColour,
				title: g.name,
				description: `Owner: ${client.users.get(g.ownerID) ? client.users.get(g.ownerID).username + "#" + client.users.get(g.ownerID).discriminator + " (" + g.ownerID + ")" : "Unknown"}`,
				fields: [
					{ name: "Overall Users", value: g.members.size, inline: true },
					{ name: "Bots", value: g.members.filter(m => m.bot).length, inline: true },
					{ name: "Users", value: g.members.filter(m => !m.bot).length, inline: true },
					{ name: "%", value: `${bp}% (${bp > 75 ? "NO" : "OK"})`, inline: true },
				]
			}});
		};
	}

	if (args[0] === "black") {
		if (!args[1] || isNaN(args[1])) return msg.channel.createMessage({ embed: {
			color: config.options.embedColour,
			title: "You need to specify an ID"
		}});

		msg.channel.createMessage({ embed: {
			color: config.options.embedColour,
			title: ":warning: Command not finished."
		}});
	};
}

exports.usage = {
	main: "{prefix}{command}",
	args: "< farm | leave | find | black | member | inv > < id/number >",
	description: "Developer command"
};
