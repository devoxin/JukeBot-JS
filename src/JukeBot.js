const config      = require("./config.json");
const permissions = require("../util/Permissions.js");
const fs          = require("fs");
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

client.on("guildDelete", g => {
	if (fs.existsSync(`./data/${g.id}.json`)) fs.unlinkSync(`./data/${g.id}.json`);
	delete guilds[g.id];
})

client.on("messageCreate", msg => {
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

	if (fs.existsSync(`./aliases.json`)) {
		delete require.cache[require.resolve("./aliases.json")];
		let aliases = require("./aliases.json");
		if (aliases[command]) command = aliases[command];
	}

	if (fs.existsSync(`./commands/${command}.js`)) {
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

client.on("voiceChannelLeave", (member, oldC) => {
	if (member.bot || permissions.isDonator(member.guild.ownerID) || !client.voiceConnections.get(member.guild.id) || !client.voiceConnections.get(member.guild.id).channelID ||
	oldC.id !== client.voiceConnections.get(member.guild.id).channelID || !guilds[member.guild.id]) return;

	let vc = client.voiceConnections.get(member.guild.id).channelID
	if (client.getChannel(vc).voiceMembers.filter(m => !m.bot).length <= 0) {
		if (client.getChannel(guilds[member.guild.id].msgc)) {
			client.getChannel(guilds[member.guild.id].msgc).createMessage({ embed: {
				color: 0x1E90FF,
				title: "Empty voicechannel",
				description: "JukeBot will leave the voicechannel if it's empty for 5 minutes."
			}});
		}
		guilds[member.guild.id].timeout = Date.now() + 300000
	}
});

client.on("voiceChannelJoin", (member, newC) => {
	if (member.bot || !client.voiceConnections.get(member.guild.id) || !client.voiceConnections.get(member.guild.id).channelID ||
	newC.id !== client.voiceConnections.get(member.guild.id).channelID || !guilds[member.guild.id]) return;

	delete guilds[member.guild.id].timeout;
})

function init(id) {
	if (!fs.existsSync(`./data/`))           fs.mkdirSync(`./data/`)
	if (!fs.existsSync(`./data/${id}.json`)) fs.writeFileSync(`./data/${id}.json`, JSON.stringify(template, "", "\t"))

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

setInterval(() => {

	let expired = Object.keys(guilds).filter(g => guilds[g].timeout && Date.now() >= guilds[g].timeout);

	if (expired.length === 0) return false;

	expired.map(g => {
		guilds[g].queue.splice(1, guilds[g].queue.length);
		client.leaveVoiceChannel(client.voiceConnections.get(g).channelID);
	})

}, 20000); // SPAGHETTI CODE
