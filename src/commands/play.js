const ytutil           = require("../../util/youtubeHandler.js")
const scutil           = require("../../util/soundcloudHandler.js")
const sthandle         = require("../streamHandler.js")
const messageCollector = require("../../util/messageCollector.js");

const ytrx = new RegExp("(?:youtube\\.com.*(?:\\?|&)(?:v|list)=|youtube\\.com.*embed\\/|youtube\\.com.*v\\/|youtu\\.be\\/)((?!videoseries)[a-zA-Z0-9_-]*)");
const scrx = new RegExp("((https:\/\/)|(http:\/\/)|(www.)|(s))+(soundcloud.com\/)+[a-zA-Z0-9-.]+(\/)+[a-zA-Z0-9-.]+");

exports.run = async function (client, msg, args, db) {
	if (!args[0]) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "You need to specify something",
		description: "YouTube: Search Term, URL or Playlist URL\nSoundCloud: URL"
	}});

	if (!client.voiceConnections.get(msg.channel.guild.id)) {
		if (!msg.member.voiceState.channelID)
			return msg.channel.createMessage({ embed: {
				color: 0x1E90FF,
				title: "Join a voicechannel first",
			}});

		if (!msg.channel.guild.channels.get(msg.member.voiceState.channelID).permissionsOf(client.user.id).has("voiceConnect") || !msg.channel.guild.channels.get(msg.member.voiceState.channelID).permissionsOf(client.user.id).has("voiceSpeak"))
			return msg.channel.createMessage({ embed: {
				color: 0x1E90FF,
				title: "Unable to Connect",
				description: "This channel doesn't allow me to connect/speak."
			}});


		await client.joinVoiceChannel(msg.member.voiceState.channelID)
		.catch(e => {
			msg.channel.createMessage({ embed: {
				color: 0x1E90FF,
				title: "Unable to Connect",
				description: e.message
			}});
		});

		if (!client.voiceConnections.get(msg.channel.guild.id) || !client.voiceConnections.get(msg.channel.guild.id).channelID) return;

	} else if (msg.member.voiceState.channelID !== client.voiceConnections.get(msg.channel.guild.id).channelID)
		return msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: "Join my voicechannel to queue.",
		}});

	let guild = guilds[msg.channel.guild.id];
	guild.msgc = msg.channel.id;

	if (guild.queue.length >= 20 && !permissions.isDonator(msg.channel.guild.ownerID)) return msg.channel.createMessage({ embed: {
		color: 0x1E90FF,
		title: "Queue Limit Reached",
		description: "You've hit the server queue limit. Wait for the queue to deplete before queueing more songs."
	}})

	const query = args.join(" ").replace(/<|>g/g, "");
	const ytrxm = query.match(ytrx);
	const scrxm = query.match(scrx);

	let res = {};

	if ((!ytrxm || !ytrxm[1]) && (!scrxm || !scrxm[1])) {

		res.src = "youtube";
		res.type = "search";
		res.items = await ytutil.search(query);

	} else {

		if (ytrxm && ytrxm[1]) {

			res.src = "youtube";

			if (ytrxm[1].length >= 15) {
				res.type = "playlist";
				res.items = await ytutil.getPlaylist(ytrxm[1], (permissions.isDonator(msg.member.id) ? "75" : "20"));
			} else {
				res.type = "url";
				res.items = await ytutil.videoInfo(ytrxm[1]);
			}

		} else {

			res.src = "soundcloud";
			res.type = "soundcloud";
			res.items = await scutil.getTrack(query);

		};

	};

	if (res.length === 0) {
		if (client.voiceConnections.get(msg.channel.guild.id).channelID && guild.queue.length === 0) client.leaveVoiceChannel(client.voiceConnections.get(msg.channel.guild.id).channelID);
		return msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: "No results found.",
		}});
	};

	if (res.type !== "search") {

		res.items.map(v => guild.queue.push({ id: v.id, title: v.title, req: msg.author.id, src: res.src, durl: (res.src === "soundcloud" ? scrxm[1] : undefined) }));
		let embed = {
			color: 0x1E90FF,
			title: `Enqueued ${res.items[0].title}`
		}
		if (res.type === "playlist") embed.description = `...and ${res.items.slice(1).length} songs.`;

		msg.channel.createMessage({ embed: embed });

	} else {

		let src = await msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: "Select Song",
			description: res.items.map((v, i) => `**${i + 1}.** ${v.snippet.title}`).join("\n"),
			footer: {
				text: "1, 2 or 3 || c to cancel selection"
			}
		}});

		const collector = await messageCollector.awaitMessages(client, msg.channel, (m => m.author.id === msg.author.id && ((parseInt(m.content) && m.content >= 1 && m.content <= res.items.length) || m.content.toLowerCase().startsWith(db.prefix + "p") || m.content === "c")), {
			maxMatches: 1,
			time: 10000
		});

		if (collector.length === 0 || collector[0].content.toLowerCase().startsWith(db.prefix + "p") || collector[0].content === "c") {
			if (client.voiceConnections.get(msg.channel.guild.id).channelID && guild.queue.length === 0) client.leaveVoiceChannel(client.voiceConnections.get(msg.channel.guild.id).channelID);
			return src.delete();
		};

		if (msg.channel.permissionsOf(client.user.id).has("manageMessages")) collector[0].delete();
		guild.queue.push({ id: res.items[collector[0].content - 1].id.videoId, title: res.items[collector[0].content - 1].snippet.title, req: msg.author.id, src: "youtube" });

		src.edit({embed: {
			color: 0x1E90FF,
			title: `Enqueued ${res.items[collector[0].content - 1].snippet.title}`,
			description: `Requested by ${msg.author.username}#${msg.author.discriminator}`
		}});

	};

	sthandle.play(guild, client);

}

exports.usage = {
	main: "{prefix}{command}",
	args: "<YouTube URL/Playlist/Search | Soundcloud URL>"
};
