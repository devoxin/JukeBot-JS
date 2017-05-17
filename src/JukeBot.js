config       = require("./config.json");
if (!config.keys.discord || config.keys.discord.length <= 30)
	return console.log("Invalid token specified. Please ensure you haven't specified the ClientID/ClientSecret");
permissions  = require("../util/Permissions.js");
const sf     = require("snekfetch");
const Eris   = require("eris");
const client = new Eris.Client(config.keys.discord, {
	disableEvents: {
		"GUILD_BAN_ADD"  : true,
		"GUILD_BAN_REMOVE" : true,
		"MESSAGE_DELETE" : true,
		"MESSAGE_DELETE_BULK" : true,
		"MESSAGE_UPDATE" : true,
		"PRESENCE_UPDATE" : true,
		"TYPING_START" : true,
		"USER_UPDATE" : true
	},
	messageLimit: 0,
	maxShards: config.options.shards
});

guilds   = {};
prefixes = require("./prefixes.json");

client.on("ready", async () => {
	console.log(`[SYSTEM] Ready! (User: ${client.user.username})`);
	client.editStatus("online", { name: `${config.options.prefix}help | v${config.version}` });

	client.guilds.forEach(g => {
		if (!prefixes[g.id]) prefixes[g.id] = config.options.prefix;
		if (!guilds[g.id]) guilds[g.id] = { id: g.id, msgc: "", queue: [], svotes: [], repeat: "None" };
	});
});

client.on("guildCreate", g => {
	if ((g.members.filter(m => m.bot).length / g.members.size) >= 0.68) return g.leave();
	g.defaultChannel.createMessage("Hey there, I'm JukeBot! You can view my commands with `$help`. Please report any issues to CrimsonXV#0387!");

	prefixes[g.id] = config.options.prefix;
	guilds[g.id] = { id: g.id, msgc: "", queue: [], svotes: [], repeat: "None" };

	if (!config.botlists || !config.botlists._clientid) return;
	if (config.botlists.dbots)
		sf.post(`https://bots.discord.pw/api/bots/${config.botlists._clientid}/stats`).send({ "server_count": client.guilds.size }).set("Authorization", config.botlists.dbots).end();
	if (config.botlists.dbl)
		sf.post(`https://discordbots.org/api/bots/${config.botlists._clientid}/stats`).send({ "server_count": client.guilds.size }).set("Authorization", config.botlists.dbl).end();
})

client.on("guildDelete", g => {
	delete prefixes[g.id];
	delete guilds[g.id];

	if (!config.botlists || !config.botlists._clientid) return;
	if (config.botlists.dbots)
		sf.post(`https://bots.discord.pw/api/bots/${config.botlists._clientid}/stats`).send({ "server_count": client.guilds.size }).set("Authorization", config.botlists.dbots).end();
	if (config.botlists.dbl)
		sf.post(`https://discordbots.org/api/bots/${config.botlists._clientid}/stats`).send({ "server_count": client.guilds.size }).set("Authorization", config.botlists.dbl).end();
})

client.on("messageCreate", async msg => {
	if (!msg.channel.guild || msg.author.bot || !guilds[msg.channel.guild.id] || permissions.isBlocked(msg.member)) return;

	if (msg.mentions.find(u => u.id === client.user.id) && msg.content.toLowerCase().includes("help"))
		return msg.channel.createMessage({ embed: {
			color: config.options.embedColour,
			title: `Use ${prefixes[msg.channel.guild.id]}help for commands`
		}});

	if (!msg.content.startsWith(prefixes[msg.channel.guild.id]) || !msg.channel.permissionsOf(client.user.id).has("sendMessages") || !msg.channel.permissionsOf(client.user.id).has("embedLinks")) return;

	let command = msg.content.slice(prefixes[msg.channel.guild.id].length).toLowerCase().split(" ")[0];
	const args  = msg.content.split(" ").slice(1);
	console.log(`${msg.author.username} > ${msg.content}`);

	delete require.cache[require.resolve("./aliases.json")];
	let aliases = require("./aliases.json");
	if (aliases[command]) command = aliases[command];

	try {
		delete require.cache[require.resolve(`./commands/${command}`)];
		require(`./commands/${command}`).run(client, msg, args);
	} catch(e) {
		if (e.message.includes("Cannot find module") || e.message.includes("ENOENT")) return;
		msg.channel.createMessage({ embed: {
			color: config.options.embedColour,
			title: `${command} failed`,
			description: `The command failed to run. The error has been logged.`
		}});
		console.error(`[ERROR] ${e.message}\n${e.stack.split("\n")[0]}\n${e.stack.split("\n")[1]}`);
	}
})

client.connect();

process.on("uncaughtException", err => {
	console.log(err.message)
});
