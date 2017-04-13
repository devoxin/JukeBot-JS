const ytutil     = require("../util/youtubeHandler.js");
const yt         = require("ytdl-core");
const rs         = require("retry-stream");

exports.play = async function play(guild, client) {
	if (!client.guilds.get(guild.id)                  ||
		!client.voiceConnections.get(guild.id)        ||
		client.voiceConnections.get(guild.id).playing ||
		client.voiceConnections.get(guild.id).paused
	) return;

	let song = guild.queue[0];

	if (song.src === "youtube") {

		let vinf = await ytutil.getFormats(song.id);
		if (!vinf.streamable) {
			if (client.getChannel(guild.msgc) && client.getChannel(guild.msgc).permissionsOf(client.user.id).has("sendMessages"))
				client.getChannel(guild.msgc).createMessage({embed: {
					color: 0x1E90FF,
					title: "Song Unplayable",
					description: "No audio formats found."
				}});
			return queueCheck(guild, client)
		}

		song.duration = await ytutil.getDuration(song.id);

		client.voiceConnections.get(guild.id).play(rs(vinf.url));

		song.started = Date.now();

		if (client.getChannel(guild.msgc) && client.getChannel(guild.msgc).permissionsOf(client.user.id).has("sendMessages"))
			client.getChannel(guild.msgc).createMessage({embed: {
				color: 0x1E90FF,
				title: "Now Playing",
				description: `[${song.title}](https://youtu.be/${song.id})`
			}});

		client.voiceConnections.get(guild.id).once("end", () => {
			queueCheck(guild, client, song);
		});

	} else if (song.src === "soundcloud") {

		if (client.getChannel(guild.msgc) && client.getChannel(guild.msgc).permissionsOf(client.user.id).has("sendMessages"))
			client.getChannel(guild.msgc).createMessage({embed: {
				color: 0x1E90FF,
				title: "Now Playing",
				description: song.title
			}});
		client.voiceConnections.get(guild.id).play(song.id);
		client.voiceConnections.get(guild.id).once("end", () => {
			queueCheck(guild, client, song);
		});

	}

}

function queueCheck(guild, client, song) {
	if (guild.repeat === "All" && song) {
		delete song.started;
		delete song.duration;
		guild.queue.push(song);
	}
	if (guild.repeat === "None" || guild.repeat === "All") guild.queue.shift();
	guild.svotes = [];
	if (guild.queue.length > 0) return exports.play(guild, client);
	if (client.getChannel(guild.msgc) && client.getChannel(guild.msgc).permissionsOf(client.user.id).has("sendMessages"))
		client.getChannel(guild.msgc).createMessage({embed: {
			color: 0x1E90FF,
			title: "Queue concluded!",
		}});
	if (client.voiceConnections.get(guild.id).channelID) client.leaveVoiceChannel(guild.id);
}
