const ytutil = require("../../util/youtubeHandler.js")
const sthandle = require("../streamHandler.js")

let rx = /(?:[?&]v=|\/embed\/|\/1\/|\/v\/|youtu\.be\/)([^&\n?#]+)/

exports.run = async function (client, msg, args, guilds, Discord) {
	if (!args[0]) return msg.channel.sendEmbed(new Discord.RichEmbed().setColor("#1E90FF").setDescription("Specify a song to search or a URL."));
	let guild = guilds[msg.guild.id]

	if (!msg.guild.voiceConnection) {
		if (!msg.member.voiceChannel)
			return msg.channel.sendEmbed(new Discord.RichEmbed().setColor("#1E90FF").setTitle("Join a voicechannel first."));

		if (!msg.member.voiceChannel.permissionsFor(client.user).hasPermission("CONNECT") || !msg.member.voiceChannel.permissionsFor(client.user).hasPermission("SPEAK"))
			return msg.channel.sendEmbed(new Discord.RichEmbed().setColor("#1E90FF").setTitle(":warning: Permissions 'Connect' or 'Speak' are missing."));

		guild.msgc = msg.channel
		await msg.member.voiceChannel.join()
		.catch(e => {
			return msg.channel.sendEmbed(new Discord.RichEmbed().setColor("#1E90FF").setTitle(":warning: Failed to join voice channel.").setDescription(e.message));
		})

	} else if (msg.member.voiceChannel !== msg.guild.voiceConnection.channel)
		return msg.channel.sendEmbed(new Discord.RichEmbed().setColor("#1E90FF").setTitle("You need to be in my voicechannel to queue."));

	let rxm = args.join(" ").replace(/<|>/g, "").match(rx)
	let query = rxm ? rxm[1] : args.join(" ").replace(/<|>/g, "")

	let res = await ytutil.search(query)
	if (res.length === 0)
		return msg.channel.sendEmbed(new Discord.RichEmbed().setColor("#1E90FF").setTitle("No results found."))

	msg.channel.sendEmbed(
		new Discord.RichEmbed()
		.setColor("#1E90FF")
		.setTitle("Select Song")
		.setDescription(res.map((v, i) => `**${i + 1}.** ${v.snippet.title}`).join("\n"))
		.setFooter("1, 2 or 3 || c to cancel selection.")
	).then(src => {
		const collector = msg.channel.createCollector(m => m.author.id === msg.author.id)
		collector.on("message", m => {
			if ((parseInt(m) && m.content >= 1 && m.content <= res.length) || m.content.toLowerCase().startsWith(guild.prefix + "p") || m.content === "c") {
				collector.stop();
				m.delete();
				if (m.content === "c" && msg.guild.voiceConnection && guild.queue.length === 0) msg.guild.voiceConnection.disconnect();
				if (m.content.toLowerCase().startsWith(guild.prefix + "p") || m.content === "c") return src.delete();
				guild.queue.push({ id: res[m.content - 1].id.videoId, title: res[m.content - 1].snippet.title, req: m.author.id });
				src.edit("", { embed: new Discord.RichEmbed()
					.setColor("#1E90FF")
					.setTitle(`Enqueued ${res[m.content - 1].snippet.title}`)
					.setDescription(`Requested by ${m.author.username}#${m.author.discriminator}`)
				});
				sthandle.play(guild, client, Discord);
			}
		})
	})
}
