const config      = require("./config.json");
permissions       = require("../util/Permissions.js");
rethonk           = require("rethinkdbdash")();
const superagent  = require("superagent");
const Eris        = require("eris");
const client      = new Eris(config.token);

let guilds = {}

client.on("ready", async () => {
	console.log(`[SYSTEM] Ready! (User: ${client.user.username})`);
	client.editStatus("online", { name: `${config.prefix}help | v${config.version}` });
	let dbs = await rethonk.dbList().run()
	if (!dbs.includes("data")) {
		await rethonk.dbCreate("data").run();
		await rethonk.db("data").tableCreate("guilds");
	}
});

client.on("guildCreate", g => {
	if ((g.members.filter(m => m.bot).length / g.members.size) >= 0.68) return g.leave();
	g.defaultChannel.createMessage("Hey there, I'm JukeBot! You can view my commands with `$help`. Please report any issues to CrimsonXV#0387!");

	rethonk.db("data").table("guilds").insert({ id: g.id, prefix: config.prefix, whitelist: [], blocked: [], admins: [] }).run();
	guilds[g.id] = { id: g.id, msgc: "", queue: [], svotes: [], repeat: "None" };

	if (!config.botlists._clientid) return;
	if (config.botlists.dbots)
		superagent.post(`https://bots.discord.pw/api/bots/${config.botlists._clientid}/stats`).send({ "server_count": client.guilds.size }).set("Authorization", config.botlists.dbots).end();
	if (config.botlists.dbl)
		superagent.post(`https://discordbots.org/api/bots/${config.botlists._clientid}/stats`).send({ "server_count": client.guilds.size }).set("Authorization", config.botlists.dbl).end();
})

client.on("guildDelete", g => {
	rethonk.db("data").table("guilds").get(g.id).delete().run();
	delete guilds[g.id];

	if (!config.botlists._clientid) return;
	if (config.botlists.dbots)
		superagent.post(`https://bots.discord.pw/api/bots/${config.botlists._clientid}/stats`).send({ "server_count": client.guilds.size }).set("Authorization", config.botlists.dbots).end();
	if (config.botlists.dbl)
		superagent.post(`https://discordbots.org/api/bots/${config.botlists._clientid}/stats`).send({ "server_count": client.guilds.size }).set("Authorization", config.botlists.dbl).end();
})

client.on("messageCreate", async msg => {
	if (!guilds[msg.channel.guild.id])
		guilds[g.id] = { id: g.id, msgc: "", queue: [], svotes: [],	repeat: "None" };

	if (msg.channel.type === 1 || msg.author.bot || !guilds[msg.channel.guild.id]) return;

	if (!await rethonk.db("data").table("guilds").get(g.id).run()))
		rethonk.db("data").table("guilds").insert({ id: g.id, prefix: config.prefix, whitelist: [], blocked: [], admins: [] }).run();

	let db = await rethonk.db("data").table("guilds").get(msg.channel.guild.id).run();
	if (!db || permissions.isBlocked(msg.member.id, msg.channel.guild, db)) return;

	if (msg.mentions.find(u => u.id === client.user.id) && msg.content.toLowerCase().includes("help"))
		return msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: `Use ${db.prefix}help for commands`
		}});

	if (!msg.content.startsWith(db.prefix) || !msg.channel.permissionsOf(client.user.id).has("sendMessages") || !msg.channel.permissionsOf(client.user.id).has("embedLinks")) return;

	msg.guild = msg.channel.guild;
	let command = msg.content.substring(db.prefix.length).toLowerCase().split(" ")[0];
	const args  = msg.content.split(" ").slice(1);
	console.log(`${msg.author.username} > ${msg.content}`);

	delete require.cache[require.resolve("./aliases.json")];
	let aliases = require("./aliases.json");
	if (aliases[command]) command = aliases[command];

	try {
		delete require.cache[require.resolve(`./commands/${command}`)];
		require(`./commands/${command}`).run(client, msg, args, guilds, db);
	} catch(e) {
		if (e.message.includes("Cannot find module") || e.message.includes("ENOENT")) return;
		msg.channel.createMessage({ embed: {
			color: 0x1E90FF,
			title: `${command} failed`,
			description: `The command failed to run. The error has been logged.`
		}});
		console.log(`E: ${command} failed\n\n${e.message}\n${e.stack}`);
	}
})

client.connect();

process.on("uncaughtException", err => {
	console.log(err.message)
});
