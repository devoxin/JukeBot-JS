const timeParser = require("../../util/timeParser.js");

exports.run = function (client, msg, args) {

	if (guilds[msg.channel.guild.id].queue.length === 0)
		return msg.channel.createMessage({ embed: {
			color: config.options.embedColour,
			title: "There's nothing playing"
		}});

	let guild = guilds[msg.channel.guild.id];
	let track = guild.queue[0];

	let embed = {
		color       : config.options.embedColour,
		title       : track.title,
		url         : track.src !== "soundcloud" ? `https://youtu.be/${track.id}` : undefined,
		description : `${timeParser.formatSeconds(client.voiceConnections.get(msg.channel.guild.id).current.playTime / 1000)}${track.src === "youtube" ? "/" + timeParser.formatSeconds(track.duration) : ""}`,
		footer: {
			text: `Requested by ${client.users.get(track.req) ? client.users.get(track.req).username : "Unknown"}`
		}
	};

	msg.channel.createMessage({ embed: embed });

}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Shows info about the currently playing song"
};
