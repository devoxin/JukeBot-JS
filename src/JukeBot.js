global.config   = require('./config.json');

const sch       = require('../util/soundcloudHandler.js');
const extras    = require('../util/extras.js');
const collector = require('../util/messageCollector.js');
const Eris      = require('../util/extensionLoader.js')(require('eris'));

const client = new Eris.Client(config.keys.discord, {
    disableEvents: extras.disable('GUILD_BAN_ADD', 'GUILD_BAN_REMOVE', 'MESSAGE_DELETE', 'MESSAGE_DELETE_BULK', 'MESSAGE_UPDATE', 'PRESENCE_UPDATE', 'TYPING_START', 'USER_UPDATE'),
    messageLimit: 0,
    maxShards: 'auto',
    opusOnly: true
});

client.messageCollector = new collector(client);
sch.updateClientID();

Object.defineProperty(Eris.TextChannel.prototype, 'awaitMessages', {
    async value(predicate, options = {}) {
        return await client.messageCollector.awaitMessages(predicate, options, this.id);
    }
});

global.guilds   = {};

client.on('ready', async () => {
    console.log(`[JukeBot] Ready! (User: ${client.user.username})`);
    client.editStatus('online', { name: `${config.options.prefix}help` });

    client.guilds.forEach(g => {
        if (!guilds[g.id])
            guilds[g.id] = { id: g.id, msgc: '', queue: [], svotes: [], repeat: 'None' };
    });
});

client.on('guildCreate', async (g) => {
    if (g.members.filter(m => m.bot).length / g.members.size >= 0.60)
        return g.leave();

    guilds[g.id] = { id: g.id, msgc: '', queue: [], svotes: [], repeat: 'None' };
});

client.on('guildDelete', async (g) => {
    delete guilds[g.id];
});

client.on('messageCreate', async (msg) => {

    if (msg.isFromDM || msg.author.bot || !guilds[msg.channel.guild.id] || (msg.member && msg.member.isBlocked)) return;

    if (msg.mentions.find(m => m.id === client.user.id) && msg.content.toLowerCase().includes('help'))
        return msg.channel.createMessage({ embed: {
            color: config.options.embedColour,
            title: `Use ${config.options.prefix}help for commands`
        }});

    if (!msg.content.startsWith(config.options.prefix) || !msg.channel.hasPermissions(client.user.id, 'sendMessages', 'embedLinks')) return;

    let command = msg.content.slice(config.options.prefix.length).toLowerCase().split(' ')[0];
    const args  = msg.content.split(' ').slice(1);
    console.log(`${msg.author.username} > ${msg.content}`);

    delete require.cache[require.resolve('./aliases.json')];
    const aliases = require('./aliases.json');
    if (aliases[command]) command = aliases[command];

    try {
        delete require.cache[require.resolve(`./commands/${command}`)];
        require(`./commands/${command}`).run(client, msg, args);
    } catch(e) {
        if (e.message.includes('Cannot find module') || e.message.includes('ENOENT')) return;
        msg.channel.createMessage({ embed: {
            color: config.options.embedColour,
            title: `${command} failed`,
            description: 'The command failed to run. The error has been logged.'
        }});
        console.error(`[ERROR] ${e.message}\n${e.stack.split('\n')[0]}\n${e.stack.split('\n')[1]}`);
    }
});

client.connect();