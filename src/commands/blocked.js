exports.run = function (client, msg, args, guilds) {

	let blocked = require(`../data/${msg.guild.id}.json`).blocked;
	delete require.cache[`../data/${msg.guild.id}.json`];

	let page    = parseInt(args[0]) ? parseInt(args[0]) : 1
	let maxPage = Math.ceil(blocked.length / 10)
	if (page < 1)       page = 1;
	if (page > maxPage) page = maxPage;
	let startQueue = (page - 1) * 10
	let endQueue   = startQueue + 10 > blocked.length ? blocked.length : startQueue + 10

	msg.channel.createMessage({
		embed: {
			color: 0x1E90FF,
			title: "Blacklist",
			description: blocked.slice(startQueue, endQueue).map(a => client.users.get(a) ? `${client.users.get(a).username}#${client.users.get(a).discriminator}` : "Unknown User").sort().join("\n"),
			footer: {
				text: `Page ${page}/${maxPage}`
			}
		}
	})

}
