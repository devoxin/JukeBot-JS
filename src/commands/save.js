const fs = require("fs");

exports.run = async function (client, msg, args) {

	if (guilds[msg.channel.guild.id].queue.length === 0)
		return msg.channel.createMessage({ embed: {
			color: config.options.embedColour,
			title: "Nothing is queued."
		}});

	let dmc = await msg.author.getDMChannel()
	.catch(err => {
		return undefined
	});

	if (!dmc) return msg.channel.createMessage({ embed: {
		color: config.options.embedColour,
		title: "There was an error fetching a DM channel."
	}});

	if (args[0] && args[0] === "-q") {
		let m = await msg.channel.createMessage({ embed: {
			color: config.options.embedColour,
			title: "Compiling queue..."
		}});

		let queue = guilds[msg.channel.guild.id].queue.map(s => `${s.title} (${s.src === "youtube" ? `https://youtu.be/${s.id}` : s.durl})`).join("\r\n");

		dmc.createMessage("", {
			name: "queue.txt",
			file: Buffer.from(queue, "utf8")
		})
		.then(() => {
			m.edit({ embed: {
				color: config.options.embedColour,
				title: "You have been DM'd the queue."
			}})
		})
		.catch(err => {
			m.edit({ embed: {
				color: config.options.embedColour,
				title: err.message
			}})
		});
	} else {
		let song = guilds[msg.channel.guild.id].queue[0];

		dmc.createMessage({ embed: {
			color: config.options.embedColour,
			title: song.title,
			url  : song.src === "youtube" ? `https://youtu.be/${song.id}` : song.durl
		}});
	}
}

exports.usage = {
	main: "{prefix}{command}",
	args: "[-q]",
	description: "DMs you info about the currently playing song (or queue, if '-q' is specified)"
};
