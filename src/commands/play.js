const ytutil           = require("../../util/youtubeHandler.js")
const scutil           = require("../../util/soundcloudHandler.js")
const sthandle         = require("../streamHandler.js")
const messageCollector = require("../../util/messageCollector.js");

const ytrx = new RegExp("(?:youtube\\.com.*(?:\\?|&)(?:v|list)=|youtube\\.com.*embed\\/|youtube\\.com.*v\\/|youtu\\.be\\/)((?!videoseries)[a-zA-Z0-9_-]*)");
const scrx = new RegExp("((https:\/\/)|(http:\/\/)|(www.)|(s))+(soundcloud.com\/)+[a-zA-Z0-9-.]+(\/)+[a-zA-Z0-9-.]+");

exports.run = async function (client, msg, args, guilds) {
	if (!args[0]) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "You need to specify something",
		description: "YouTube: Search Term, URL or Playlist URL\nSoundCloud: URL"
	}});

	let guild = guilds[msg.guild.id]

	if (!client.voiceConnections.get(msg.guild.id)) {
		if (!msg.member.voiceState.channelID)
			return msg.channel.createMessage({ embed: {
				color: 0x1E90FF,
				title: "Join a voicechannel first",
			}});

		if (!msg.guild.channels.get(msg.member.voiceState.channelID).permissionsOf(client.user.id).has("voiceConnect") ||
			!msg.guild.channels.get(msg.member.voiceState.channelID).permissionsOf(client.user.id).has("voiceSpeak"))
			return msg.channel.createMessage({ embed: {
				color: 0x1E90FF,
				title: ":warning: Permissions 'Connect' or 'Speak' are missing.",
			}});


		await client.joinVoiceChannel(msg.member.voiceState.channelID)
		.catch(e => {
			msg.channel.createMessage({ embed: {
				color: 0x1E90FF,
				title: "Failed to join voicechannel",
				description: e.message
			}});
		});

		if (!client.voiceConnections.get(msg.guild.id) || !client.voiceConnections.get(msg.guild.id).channelID) return false;
		guild.msgc = msg.channel.id

	} else if (msg.member.voiceState.channelID !== client.voiceConnections.get(msg.guild.id).channelID)
		return msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: "Join my voicechannel to queue.",
		}});

	if (guild.queue.length >= 20) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "Queue Limit Reached",
		description: "You've hit the server queue limit. Wait for the queue to deplete before queueing more songs."
	}})

	let ytrxm = args.join(" ").replace(/<|>/g, "").match(ytrx)
	let scrxm = args.join(" ").replace(/<|>/g, "").match(scrx)

	if ((ytrxm && ytrxm[1]) || (!scrxm || !scrxm[1])) {

		if (ytrxm && ytrxm[1]) {

			if (ytrxm[1].length >= 15) { //treat as playlist

				let m = await msg.channel.createMessage({ embed: {
					color: 0x1E90FF,
					title: "Importing..."
				}})
				let res = await ytutil.getPlaylist(ytrxm[1]);
				if (res.length === 0) {
					if (client.voiceConnections.get(msg.guild.id).channelID && guild.queue.length === 0) client.leaveVoiceChannel(client.voiceConnections.get(msg.guild.id).channelID);
					return m.edit({ embed: {
						color: 0x1E90FF,
						title: "No results found.",
					}});
				}
				res.map(v => guild.queue.push({ id: v.id, title: v.title, req: msg.author.id, src: "youtube" }));
				m.edit({ embed: {
					color: 0x1E90FF,
					title: `Imported ${res.length} songs.`
				}});
				sthandle.play(guild, client);

			} else {

				let res = await ytutil.videoInfo(ytrxm[1])
				if (res.length === 0) {
					if (client.voiceConnections.get(msg.guild.id).channelID && guild.queue.length === 0) client.leaveVoiceChannel(client.voiceConnections.get(msg.guild.id).channelID);
					return msg.channel.createMessage({ embed: {
						color: 0x1E90FF,
						title: "No results found.",
					}});
				}

				guild.queue.push({ id: res[0].id, title: res[0].snippet.title, req: msg.author.id, src: "youtube" });
				msg.channel.createMessage({embed: {
					color: 0x1E90FF,
					title: `Enqueued ${res[0].snippet.title}`,
					description: `Requested by ${msg.author.username}#${msg.author.discriminator}`
				}});
				sthandle.play(guild, client);

			}

		} else { // Search for it.

			let res = await ytutil.search(args.join(" ").replace(/<|>/g, ""))
			if (res.length === 0) {
				if (client.voiceConnections.get(msg.guild.id).channelID && guild.queue.length === 0) client.leaveVoiceChannel(client.voiceConnections.get(msg.guild.id).channelID);
				return msg.channel.createMessage({ embed: {
					color: 0x1E90FF,
					title: "No results found.",
				}});
			}

			let src = await client.createMessage(msg.channel.id, {
				embed: {
					color: 0x1E90FF,
					title: "Select Song",
					description: res.map((v, i) => `**${i + 1}.** ${v.snippet.title}`).join("\n"),
					footer: {
						text: "1, 2 or 3 || c to cancel selection"
					}
				}
			})

			const collector = await messageCollector.awaitMessages(
				client,
				msg.channel,
				(m => m.author.id === msg.author.id && ((parseInt(m.content) && m.content >= 1 && m.content <= res.length) || m.content.toLowerCase().startsWith(guild.prefix + "p") || m.content === "c")),
				{
					maxMatches: 1,
					time      : 10000
				}
			);

			if (collector.length === 0) {
				if (client.voiceConnections.get(msg.guild.id).channelID && guild.queue.length === 0)
					client.leaveVoiceChannel(client.voiceConnections.get(msg.guild.id).channelID);
				return src.delete();
			}

			if (msg.channel.permissionsOf(client.user.id).has("manageMessages")) collector[0].delete();
			if (collector[0].content === "c" && client.voiceConnections.get(msg.guild.id).channelID && guild.queue.length === 0)
				client.leaveVoiceChannel(client.voiceConnections.get(msg.guild.id).channelID);

			if (collector[0].content.toLowerCase().startsWith(guild.prefix + "p") || collector[0].content === "c")
				return src.delete();

			guild.queue.push({ id: res[collector[0].content - 1].id.videoId, title: res[collector[0].content - 1].snippet.title, req: msg.author.id, src: "youtube" });
			src.edit({embed: {
				color: 0x1E90FF,
				title: `Enqueued ${res[collector[0].content - 1].snippet.title}`,
				description: `Requested by ${msg.author.username}#${msg.author.discriminator}`
			}});
			sthandle.play(guild, client);

		}

	} else { // Soundcloud

		let scinfo = await scutil.getTrack(args.join(" ").replace(/<|>/g, ""))
		if (!scinfo) {
			if (client.voiceConnections.get(msg.guild.id).channelID && guild.queue.length === 0) client.leaveVoiceChannel(client.voiceConnections.get(msg.guild.id).channelID);
				return msg.channel.createMessage({ embed: {
				color: 0x1E90FF,
				title: "No results found.",
			}});
		}

		guild.queue.push({ id: scinfo.id, title: scinfo.title, req: msg.author.id, src: "soundcloud" });

		msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: `Enqueued ${scinfo.title}`,
			description: `Requested by ${msg.author.username}#${msg.author.discriminator}`
		}});
		sthandle.play(guild, client);

	}
}

exports.usage = {
	main: "{prefix}{command}",
	args: "<YouTube URL/Playlist/Search | Soundcloud URL>"
};
