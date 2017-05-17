const timeParser = require("../../util/timeParser.js")

exports.run = function(client, msg, args) {

	msg.channel.createMessage({embed: {
		color: config.options.embedColour,
		title: `JukeBot v${config.version}`,
		description: `Created by CrimsonXV#0387`,
		fields: [
			{ name: `Uptime`,		  value: timeParser.formatSeconds(process.uptime()),						inline: true },
			{ name: `RAM Usage`,	  value: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,      inline: true },
			{ name: `Library`,		  value: "Eris",															inline: true },
			{ name: `Streams`,        value: `► ${client.voiceConnections.filter(vc => vc.playing).length}, ❚❚ ${client.voiceConnections.filter(vc => vc.paused).length}`, inline: true },
			{ name: `Servers`,		  value: client.guilds.size,												inline: true },
			{ name: "Latency",		  value: `${msg.channel.guild.shard.latency}ms`,							inline: true }
		]
	}});

}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "View statistics of the bot"
};
