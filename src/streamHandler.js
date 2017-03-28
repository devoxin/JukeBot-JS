const yt    = require("ytdl-core"); // HEAVY SIGH
const fs    = require("fs");

const opus  = ["249", "250", "251"];
const itag  = ["140", "141", "171"];

let downloading = [];

exports.play = (guild, client, Discord) => {
	if (downloading.includes(guild.id) || !client.guilds.get(guild.id) || !client.guilds.get(guild.id).voiceConnection || client.guilds.get(guild.id).voiceConnection.speaking) return;
	downloading.push(guild.id);
	let song = guild.queue[0]
	client.guilds.get(guild.id).voiceConnection.playStream(yt(song.id, { filter: 'audioonly' }), { passes: 2 });
}
