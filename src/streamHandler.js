const yt    = require("ytdl-core"); // HEAVY SIGH
const fs    = require("fs");

const opus  = ["249", "250", "251"];
const itag  = ["140", "141", "171"];

let downloading = [];

exports.play = async function play(guild, client, Discord) {
	if (downloading.includes(guild.id) || !client.guilds.get(guild.id) || !client.guilds.get(guild.id).voiceConnection || client.guilds.get(guild.id).voiceConnection.speaking) return;
	downloading.push(guild.id);
	// FORMAT CHECKING
	let song = guild.queue[0];
	let m = await guild.msgc.sendEmbed(
		new Discord.RichEmbed()
		.setColor("#1E90FF")
		.setTitle("Now Downloading")
		.setDescription(`[${song.title}]`)
	)
	let stream = yt(song.id, { filter: 'audioonly' }).pipe(fs.createWriteStream(`./data/${guild.id}/songs/${song.id}.mp3`))
	stream.on("close", () => {
		m.edit("", { embed: new Discord.RichEmbed()
			.setColor("#1E90FF")
			.setTitle("Now playing")
			.setDescription(`[${song.title}](https://youtu.be/${song.id})`)
		})
		client.guilds.get(guild.id).voiceConnection.playFile(`./data/${guild.id}/songs/${song.id}.mp3`, { passes: 2, volume: guild.volume })
		client.guilds.get(guild.id).voiceConnection.player.dispatcher.once("end", () => {
			queueCheck(guild, client, Discord);
		})
	})
}

function queueCheck(guild, client, Discord) {
	try {
		if (fs.existsSync(`./data/${guild.id}/songs/${song.id}.mp3`)) fs.unlinkSync(`./data/${guild.id}/songs/${song.id}.mp3`)
	} catch (e) {
		console.log(`[SHARD ${client.options.shardId}] Failed to delete ${guild.id}/${song.id}.mp3\n${e.message}`)
	}
	guild.queue.shift();
	downloading = downloading.filter(d => d !== guild.id);
	if (guild.queue.length > 0) return exports.play(guild, client, Discord);
	guild.msgc.sendEmbed(
		new Discord.RichEmbed()
		.setColor("#1E90FF")
		.setTitle("Queue concluded!")
	);
	if (client.guilds.get(guild.id).voiceConnection) client.guilds.get(guild.id).voiceConnection.disconnect();
}
