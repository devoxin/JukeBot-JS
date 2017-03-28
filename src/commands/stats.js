const config = require("../config.json")

exports.run = function(client, msg, args, guilds, Discord) {
	msg.channel.sendEmbed(
		new Discord.RichEmbed()
		.setColor("#1E90FF")
		.setTitle(`JukeBot v${config.version}`)
		.setDescription("Created by CrimsonXV#0387")
		.addField("RAM Usage", (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + " MB", true)
		.addField("WS Ping", client.ping.toFixed(0) + "ms", true)
		.setFooter("Last updated: 28/03/2017 00:50")
	);
}
