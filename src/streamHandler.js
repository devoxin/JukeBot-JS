const ytutil = require("../util/youtubeHandler.js");
const yt     = require("ytdl-core")
const bufst  = require("buffered2").BufferedStream;

exports.play = async function play(guild, client) {
	if (!client.guilds.get(guild.id)                  ||
		!client.voiceConnections.get(guild.id)        ||
		client.voiceConnections.get(guild.id).playing ||
		client.voiceConnections.get(guild.id).paused
	) return;

	let song = guild.queue[0].src === "youtube" ? new bufst() : guild.queue[0].id;

	if (guild.queue[0].src === "youtube")
		yt(guild.queue[0].id, { filter: "audioonly" }).pipe(song);


		let duration = await ytutil.getDuration(guild.queue[0].id);
		if (duration > 3600) {
			if ((duration > 3600 && !permissions.isDonator(guild.queue[0].req)) || (duration > 7200 && permissions.isDonator(guild.queue[0].req))) {
				if (client.getChannel(guild.msgc)) client.getChannel(guild.msgc).createMessage({ embed: {
					color: 0x1E90FF,
					title: "This song exceeds the duration limit"
				}});
				guild.queue.shift();
				return exports.play(guild, client);
			}
		}
		//song.started = Date.now();

		client.voiceConnections.get(guild.id).play(song);

		if (client.getChannel(guild.msgc)) client.getChannel(guild.msgc).createMessage({embed: {
			color: 0x1E90FF,
			title: "Now Playing",
			description: `${guild.queue[0].title}` //(https://youtu.be/${guild.queue[0].id})`
		}}).catch(err => { console.log("Couldn't post to " + guild.msgc )});

		client.voiceConnections.get(guild.id).once("end", () => {
			song = undefined;
			guild.queue.shift();
			guild.svotes = [];
			if (guild.queue.length > 0)
				return exports.play(guild, client);
			if (client.getChannel(guild.msgc)) client.getChannel(guild.msgc).createMessage({embed: {
				color: 0x1E90FF,
				title: "Queue concluded!",
				description: "[Enjoying the music? Help keep JukeBot alive!](https://patreon.com/crimsonxv)",
				footer: {
					text: "Becoming a patron will also bag you some nice benefits too!"
				}
			}});
			if (client.voiceConnections.get(guild.id) && client.voiceConnections.get(guild.id).channelID) client.leaveVoiceChannel(guild.id);
		});

};
