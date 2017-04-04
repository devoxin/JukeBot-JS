const config     = require("../config.json")
const timeParser = require("../../util/timeParser.js")

exports.run = function(client, msg, args, guilds) {

	if (msg.author.id === "149505704569339904") return false;

	msg.channel.createMessage({embed: {
		color: 0x1E90FF,
		title: `JukeBot v${config.version}`,
		description: `Created by CrimsonXV#0387`,
		fields: [
			{ name: `Uptime`,		  value: timeParser.formatSeconds(process.uptime()),						inline: true },
			{ name: `RAM Usage`,	  value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true },
			{ name: `Library`,		  value: "Eris",															inline: true },
			{ name: `Command Usage`,  value: client["cmdstats"],												inline: true },
			{ name: `Active Streams`, value: client.voiceConnections.size,										inline: true },
			{ name: `Servers`,		  value: client.guilds.size,												inline: true },
			{ name: "Latency",		  value: `${msg.guild.shard.latency}ms`,									inline: true }
		]
	}});

}
