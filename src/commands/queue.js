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
	let endQueue   = startQueue + 10 > guild.queue.length ? guild.queue.length : 10

	let track   = guild.queue[0];
	let finish  = track.started ? track.started + (track.duration * 1000) + 2000 : undefined;
	let time    = finish ? Date.now() - track.started : undefined;

	let embed = {
		color       : 0x1E90FF,
		title       : track.title,
		url         : track.src !== "soundcloud" ? `https://youtu.be/${track.id}` : undefined,
		description : track.src !== "soundcloud" ? `${timeCon(time / 1000)}/${timeCon(track.duration)}` : undefined,
		fields: [
			{
				name: "Queue",
				value: guild.queue.slice(startQueue, endQueue).map((item, i) => `${i + 1}. ${item.title} - ${client.users.get(item.req) ? client.users.get(item.req).username : "Unknown"}`).join("\n")
			}
		],
		footer: {
			text: `Page ${page}/${maxPage}`
		}
	}

	msg.channel.createMessage({ embed: embed })

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
