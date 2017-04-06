const config      = require("./config.json");
const permissions = require("../util/Permissions.js");
const bluebird    = require("bluebird");
const fs          = bluebird.promisifyAll(require("fs"));
const Eris        = require("eris");
const client      = new Eris(config.token);

let guilds = {}
let hasInit = false;

client.on("ready", () => {
	console.log(`[SHARD READY]`)
	client.editStatus("online", { name: `${config.prefix}help | v${config.version}` })
	!hasInit && client.guilds.map(g => init(g.id));
	hasInit = true;
})

client.on("guildCreate", g => {
	g.defaultChannel.createMessage("Hey there! I'm JukeBot! To get started, send `$help`. Please report any issues to CrimsonXV#0387!")
	init(g.id);
})

client.on("guildDelete", async g => {
	if (fs.accessAsync(`./data/${g.id}.json`)) fs.unlinkAsync(`./data/${g.id}.json`);
	delete guilds[g.id];
})

client.on("messageCreate", async msg => {
	if (msg.channel.type === 'dm' || msg.author.bot || !guilds[msg.channel.guild.id]) return;
	msg.guild = msg.channel.guild;

	if (permissions.isBlocked(msg.member.id, msg.guild.id)) return false;

	if (msg.mentions.find(u => u.id === client.user.id) && msg.content.toLowerCase().includes("help"))
		return client.createMessage(msg.channel.id, {
			embed: {
				color: 0x1E90FF,
				title: `Use ${guilds[msg.guild.id].prefix}help for commands`
			}
		})

	if (!msg.content.startsWith(guilds[msg.guild.id].prefix)) return;

	let command = msg.content.substring(guilds[msg.guild.id].prefix.length).toLowerCase().split(" ")[0];
	let args    = msg.content.split(" ").slice(1)
	console.log(`${msg.author.username} > ${msg.content}`)

	if (fs.accessAsync(`./aliases.json`)) {
		delete require.cache[require.resolve("./aliases.json")];
		let aliases = require("./aliases.json");
		if (aliases[command]) command = aliases[command];
	}

	if (fs.accessAsync(`./commands/${command}.js`)) {
		if (!client["cmdstats"]) client["cmdstats"] = 0;
		client["cmdstats"]++;
		try {
			delete require.cache[require.resolve(`./commands/${command}`)];
			require(`./commands/${command}`).run(client, msg, args, guilds);
		} catch(e) {
			client.createMessage(msg.channel.id, {
				embed: {
					color: 0x1E90FF,
					title: `${command} failed`,
					description: `The command failed to run. The error has been logged.`
				}
			})
			console.log(`E: ${command} failed\n\n${e.message}\n${e.stack}`)
		}
	}

})

async function init(id) {
	if (!fs.accessAsync(`./data/`))           fs.mkdirAsync(`./data/`)
	if (!fs.accessAsync(`./data/${id}.json`)) fs.writeFileAsync(`./data/${id}.json`, JSON.stringify(template, "", "\t"))

	load(id)
}

function load(id) {
	let idconf = require(`./data/${id}.json`);
	delete require.cache[require.resolve(`./data/${id}.json`)];
	guilds[id] = {
		id     : id,
		prefix : idconf.prefix,
		msgc   : "",
		queue  : [],
		svotes : [],
		repeat : "None"
	}
}

const template = {
	prefix      : config.prefix,
	permissions : "permissive",
	admins      : [],
	blocked     : []
}

client.connect();

process.on("uncaughtException", err => {
	console.log(err.message)
})
