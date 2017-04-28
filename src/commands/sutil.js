exports.run = function (client, msg, args) {

	if (msg.author.id !== "180093157554388993" && msg.author.id !== "284122164582416385" && msg.author.id !== "172571295077105664") return;

	if (!args[0]) return msg.channel.createMessage({embed: {
		color: 0x1E90FF,
		title: "Specify an action",
		description: "< farm | leave | find | black | member | inv | db >"
	}});

	if (args[0] === "farm") {
		if (!args[1]) return msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: "You need to specify a bot % threshold"
		}});

		let g = client.guilds.filter(g => g.members.filter(m => m.bot).length / g.members.size * 100 >= args[1])
		msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: `Matches Found (${g.length})`,
			fields: [
				{ name: "\u200B", value: (g.length > 0 ? g.slice(0, 10).map(s => `**${s.name}** (${s.id})`).join("\n") : "None"), inline: true }
			]
		}});

	};

	if (args[0] === "leave") {
		if (msg.author.id !== "180093157554388993") return;
		if (!args[1] || isNaN(args[1])) return msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: "You need to specify an ID"
		}});

		if (!client.guilds.get(args[1])) return msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: ":warning: Not found"
		}});

		client.guilds.get(args[1]).leave();

		msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			description: "Success."
		}});
	};

	if (args[0] === "inv") {
		if (!args[1]) return msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: "You need to specify a server ID"
		}});

		if (!client.guilds.get(args[1])) return msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: ":warning: Not found"
		}});

		client.guilds.get(args[1]).defaultChannel.createInvite({ maxAge: 15 }).then(inv => {
			msg.channel.createMessage("discord.gg/" + inv.code)
		}).catch(err => {
			msg.channel.createMessage("Failed to generate invite")
		});

	};

	if (args[0] === "db") {
		if (!args[1]) return msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: "You need to specify a server ID"
		}});

		rethonk.db("data").table("guilds").get(args[1]).run()
		.then(data => {
    		msg.channel.createMessage({ embed: {
				color: 0x1E90FF,
				title: `${client.guilds.get(args[1]).name} Database`,
				fields: [
					{ name: "Admins", value: data.admins.length > 0 ? data.admins.join("\n") : "None", inline: true },
					{ name: "Blocked", value: data.blocked.length > 0 ? data.blocked.join("\n") : "None", inline: true },
					{ name: "Whitelist", value: data.whitelist.length > 0 ? data.whitelist.join("\n") : "None", inline: true },
					{ name: "Prefix", value: data.prefix, inline: true}
				]
			}})
		}).catch(err => {
			msg.channel.createMessage({ embed: {
				color: 0x1E90FF,
				title: "RethinkDB Error",
				description: err.message
			}})
		})
	}

	if (args[0] === "member") {
		if (!args[1]) return msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: "You need to specify a member ID"
		}});

		let servers = client.guilds.filter(g => g.members.has(args[1]));
		msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: `Servers with member: ${args[1]}`,
			fields: [
				{ name: `${servers.length} results`, value: servers.map(s => s.name).join("\n"), inline: true }
			]
		}});

	};

	if (args[0] === "find") {
		if (!args[1]) return msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: "You need to specify a name or ID"
		}});

		if (isNaN(args[1])) {

			let search = client.guilds.filter(g => g.name.toLowerCase().includes(args.slice(1).join(" ").toLowerCase()))
			return msg.channel.createMessage({ embed: {
				color: 0x1E90FF,
				title: `Search Results (${search.length})`,
				fields: [
					{ name: "\u200B", value: (search.length > 0 ? search.slice(0, 10).map(s => `**${s.name}** (${s.id})`).join("\n") : "None"), inline: true }
				]
			}});

		} else {
			if (!client.guilds.get(args[1])) return msg.channel.createMessage({ embed: {
				color: 0x1E90FF,
				title: ":warning: Not found"
			}});

			let g = client.guilds.get(args[1])
			let bp = (g.members.filter(m => m.bot).length / g.members.size * 100).toFixed(2)
			msg.channel.createMessage({ embed: {
				color: 0x1E90FF,
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
			color: 0x1E90FF,
			title: "You need to specify an ID"
		}});

		msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: ":warning: Command not finished."
		}});
	};
}

exports.usage = {
	main: "{prefix}{command}",
	args: "[ DEVELOPER COMMAND ]"
};
