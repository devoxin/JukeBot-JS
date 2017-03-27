const config  = require("./config.json");
const Discord = require("discord.js");
const fs      = require("fs");
const fse     = require("fs-extra");
const client  = new Discord.Client();

let guilds = {}
let hasInit = false;

client.on("ready", () => {
	console.log(`[SHARD READY]: ${client.options.shardId}`)
	client.user.setGame(`${config.prefix}help | v${config.version}`)
	!hasInit && client.guilds.map(g => init(g.id));
	hasInit = true;
})

client.on("message", msg => {
	if (msg.channel.type === 'dm' || msg.author.bot || !guilds[msg.guild.id]) return false;
	// is mentioned
	if (!msg.content.startsWith(guilds[msg.guild.id].prefix)) return false;

	let command = msg.content.substring(guilds[msg.guild.id].prefix.length).toLowerCase().split(" ")[0];
	let args    = msg.content.split(" ").slice(1)

	if (fs.existsSync(`./aliases.json`)) {
		delete require.cache[require.resolve("./aliases.json")];
		let aliases = require("./aliases.json");
		if (aliases[command]) command = aliases[command];
	}

	if (fs.existsSync(`./commands/${command}.js`)) {
		try {
			delete require.cache[require.resolve(`./commands/${command}`)];
			require(`./commands/${command}`).run(client, msg, args, guilds, Discord);
		} catch(e) {
			msg.channel.sendEmbed(
				new Discord.RichEmbed()
				.setColor("#1E90FF")
				.setTitle(`${command} failed`)
				.setDescription("The command failed to run. The error has been logged.")
			)
			console.log(`[SHARD ${client.options.shardId}] E: ${command} failed\n\n${e.message}\n${e.stack}`)
		}
	}

})

function init(id) {
	if (!fs.existsSync(`./data/${id}`)) fs.mkdirSync(`./data/${id}`);
	if (!fs.existsSync(`./data/${id}/songs`)) fs.mkdirSync(`./data/${id}/songs`);
	if (!fs.existsSync(`./data/${id}/config.json`)) fs.writeFileSync(`./data/${id}/config.json`, JSON.stringify(template, "", "\t"))

	load(id)
}

async function load(id) {
	let idconf = require(`./data/${id}/config.json`);
	delete require.cache[require.resolve(`./data/${id}/config.json`)];
	guilds[id] = {
		prefix : idconf.prefix,
		msgch  : "",
		queue  : [],
		volume : 1,
		svotes : [],
		repeat : false
	}
}

const template = {
	prefix      : config.prefix,
	permissions : "permissive",
	admins      : [],
	blocked     : []
}

client.login(config.token);
