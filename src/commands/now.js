const timeParser = require("../../util/timeParser.js");

exports.run = function (client, msg, args, guilds) {

	let guild   = guilds[msg.guild.id];

	if (guild.queue.length === 0)
		return msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: "There's nothing playing"
		}});

	let track   = guild.queue[0];
	let finish  = track.started ? track.started + (track.duration * 1000) + 2000 : undefined;
	let time    = finish ? Date.now() - track.started : undefined;

	let embed = {
		color       : 0x1E90FF,
		title       : track.title,
		url         : track.src !== "soundcloud" ? `https://youtu.be/${track.id}` : undefined,
		description : track.src !== "soundcloud" ? `${timeParser.formatSeconds(time / 1000)}/${timeParser.formatSeconds(track.duration)}` : undefined,
		footer: {
			text: `Requested by ${client.users.get(track.req) ? client.users.get(track.req).username : "Unknown"}`
		}
	}

	msg.channel.createMessage({ embed: embed })

}
