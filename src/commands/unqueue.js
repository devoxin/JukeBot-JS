exports.run = function(client, msg, args, guilds, Discord, settings) {
	let guild = guilds[msg.guild.id]
	if (guild.audio.queue.length <= 1) return msg.channel.sendEmbed(new Discord.RichEmbed().setColor("#1e90ff").setDescription("The queue is empty."));
	let uqargs = parseInt(args[0])
	if (isNaN(uqargs) || uqargs < 1 || uqargs > guild.audio.queue.length - 1) return msg.channel.sendMessage("Invalid position specified.")
	if (guild.audio.queue[uqargs].user.id === msg.author.id || settings.ownerID === msg.author.id || guild.general.admins.includes(msg.author.id) || msg.author.id === msg.guild.owner.user.id) {
		guild.audio.queue.splice(uqargs, 1)
		msg.channel.sendEmbed(new Discord.RichEmbed().setColor("#1e90ff").setDescription("Song unqueued."));
	} else {
		msg.channel.sendEmbed(new Discord.RichEmbed().setColor("#1e90ff").setDescription("You can't unqueue that."));
	}
}
