const ytutil = require("../util/youtubeHandler.js");
const rs     = require("retry-stream");

exports.play = async function play(guild, client) {
	if (!client.guilds.get(guild.id)                  ||
		!client.voiceConnections.get(guild.id)        ||
		client.voiceConnections.get(guild.id).playing ||
		client.voiceConnections.get(guild.id).paused
	) return;

	if (guild.queue.length === 0) {
		if (client.getChannel(guild.msgc)) client.getChannel(guild.msgc).createMessage({ embed: {
			color: 0x1E90FF,
			title: "Queue concluded!",
			description: "[Enjoying the music? Help keep JukeBot alive!](https://patreon.com/crimsonxv)",
			footer: {
				text: "Becoming a patron will also bag you some nice benefits too!"
			}
		}});
		if (client.voiceConnections.get(guild.id) && client.voiceConnections.get(guild.id).channelID) client.leaveVoiceChannel(guild.id);
		return;
	}

	let song;

	if (guild.queue[0].src === "youtube")
		let duration = await ytutil.getDuration(guild.queue[0].id);
		if (duration > 3600) {
			if ((duration > 3600 && !permissions.isDonator(guild.queue[0].req)) || (duration > 7200 && permissions.isDonator(guild.queue[0].req))) {
				if (client.getChannel(guild.msgc)) client.getChannel(guild.msgc).createMessage({ embed: {
					color: 0x1E90FF,
					title: "This song exceeds the duration limit"
				}});
				guild.queue.shift();
				exports.play(guild, client);
			}
		}

		let res = await ytutil.getFormats(guild.queue[0].id);
		if (!res.url) {
			if (client.getChannel(guild.msgc)) client.getChannel(guild.msgc).createMessage({ embed: {
				color: 0x1E90FF,
				title: "This song is unplayable"
			}});
			guild.queue.shift();
			exports.play(guild, client);
		} else {
			song = res.url;
		}
	} else {
		song = guild.queue[0].id
	}
	//song.started = Date.now();

	if (client.getChannel(guild.msgc)) client.getChannel(guild.msgc).createMessage({embed: {
		color: 0x1E90FF,
		title: "Now Playing",
		description: `${guild.queue[0].title}` //(https://youtu.be/${guild.queue[0].id})`
	}});

	client.voiceConnections.get(guild.id).play(rs(song));

	client.voiceConnections.get(guild.id).once("end", () => {
		guild.queue.shift();
		guild.svotes = [];
		exports.play(guild, client);
	});

};
