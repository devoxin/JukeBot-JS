const config = require("../config.json")

exports.run = function(client, msg, args, guilds) {

	msg.channel.createMessage({embed: {
		color: 0x1E90FF,
		title: `JukeBot v${config.version}`,
		description: `Created by CrimsonXV#0387`,
		fields: [
			{ name: `Uptime`, value: timeCon(process.uptime()), inline: true },
			{ name: `RAM Usage`, value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true },
			{ name: `Library`, value: "Eris", inline: true },
			{ name: `Command Usage`, value: client["cmdstats"], inline: true },
			{ name: `Active Streams`, value: client.voiceConnections.size, inline: true },
			{ name: `Servers`, value: client.guilds.size, inline: true },
			{ name: "Latency", value: `${msg.guild.shard.latency}ms`, inline: true }
		],
		footer: {
			text: "Last updated: 30/03/2017 00:49"
		}
	}});

}

function timeCon(time) {
    let days = Math.floor((time % 31536000) / 86400);
    let hours = Math.floor(((time % 31536000) % 86400) / 3600);
    let minutes = Math.floor((((time % 31536000) % 86400) % 3600) / 60);
    let seconds = Math.round((((time % 31536000) % 86400) % 3600) % 60);
    days = days > 9  ? days : "0" + days
    hours = hours > 9 ? hours : "0" + hours
    minutes = minutes > 9 ? minutes : "0" + minutes
    seconds = seconds > 9 ? seconds : "0" + seconds
    return (parseInt(days) > 0 ? days + ":" : "") + (parseInt(hours) === 0 && parseInt(days) === 0 ? "" : hours + ":") + minutes + ":" + seconds
}
