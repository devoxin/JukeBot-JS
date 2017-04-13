const timeParser = require("../../util/timeParser.js");

exports.run = function (client, msg, args, guilds) {

	let guild = guilds[msg.guild.id];
	if (guild.queue.length <= 1)
		return msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: "There's nothing queued"
		}});

	let page = parseInt(args[0]) ? parseInt(args[0]) : 1
	let maxPage = Math.ceil(guild.queue.length / 10);

	if (page < 1)       page = 1;
	if (page > maxPage) page = maxPage;

	let startQueue = ((page - 1) * 10) + 1;
	let endQueue   = startQueue + 10 > guild.queue.length ? guild.queue.length : startQueue + 10

	let track   = guild.queue[0];
	let finish  = track.started ? track.started + (track.duration * 1000) + 2000 : undefined;
	let time    = finish ? Date.now() - track.started : undefined;

	let embed = {
		color       : 0x1E90FF,
		title       : track.title,
		url         : track.src !== "soundcloud" ? `https://youtu.be/${track.id}` : undefined,
		description : track.src !== "soundcloud" ? `${timeParser.formatSeconds(time / 1000)}/${timeParser.formatSeconds(track.duration)}` : undefined,
		fields: [
			{
				name: "Queue",
				value: guild.queue.slice(startQueue, endQueue).map((item, i) => `${startQueue + i}. ${item.title} - ${client.users.get(item.req) ? client.users.get(item.req).username : "Unknown"}`).join("\n")
			}
		],
		footer: {
			text: `Page ${page}/${maxPage}`
		}
	}
	msg.channel.createMessage({ embed: embed }).catch(e => {})

}