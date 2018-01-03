global.config       = require('./config.json');
global.permissions  = require('../util/Permissions.js');

const extras = require('../util/extras.js');
const sf     = require('snekfetch');
const Eris   = require('../util/extensionLoader.js')(require('eris'));

const client = new Eris.Client(config.keys.discord, {
    disableEvents: extras.disable('GUILD_BAN_ADD', 'GUILD_BAN_REMOVE', 'MESSAGE_DELETE', 'MESSAGE_DELETE_BULK', 'MESSAGE_UPDATE', 'PRESENCE_UPDATE', 'TYPING_START', 'USER_UPDATE'),
    messageLimit: 0,
    maxShards: config.options.shards
});

const messageCollector = require('../util/messageCollector.js');
const collector = new messageCollector();

Object.defineProperty(Eris.TextChannel.prototype, 'awaitMessages', {
    async value(predicate) {
        return await collector.awaitMessages(predicate, this.id);
    }
});

global.guilds   = {};
global.prefixes = require('./prefixes.json');

client.on('ready', async () => {
    console.log(`[SYSTEM] Ready! (User: ${client.user.username})`);
    client.editStatus('online', { name: `${config.options.prefix}help | v${config.version}` });

    client.guilds.forEach(g => {
        if (!prefixes[g.id])
            prefixes[g.id] = config.options.prefix;

        if (!guilds[g.id])
            guilds[g.id] = { id: g.id, msgc: '', queue: [], svotes: [], repeat: 'None' };
    });

    collector.setup(client);
});

client.on('guildCreate', async (g) => {
    if (g.members.filter(m => m.bot).length / g.members.size >= 0.60)
        return g.leave();

    prefixes[g.id] = config.options.prefix;
    guilds[g.id] = { id: g.id, msgc: '', queue: [], svotes: [], repeat: 'None' };

    if (!config.botlists) return;

    for (const list of config.botlists)
        await sf.post(list.url.replace(':id', client.user.id)).send({ 'server_count': client.guilds.size }).set('Authorization', list.token);
});

client.on('guildDelete', async (g) => {
    delete prefixes[g.id];
    delete guilds[g.id];

    if (!config.botlists) return;

    for (const list of config.botlists)
        await sf.post(list.url.replace(':id', client.user.id)).send({ 'server_count': client.guilds.size }).set('Authorization', list.token);
});

client.on('messageCreate', async (msg) => {
    if (msg.isFromDM || msg.author.bot || !guilds[msg.channel.guild.id] || msg.member.isBlocked) return;

    if (msg.mentions.find(m => m.id === client.user.id) && msg.content.toLowerCase().includes('help'))
        return msg.channel.createMessage({ embed: {
            color: config.options.embedColour,
            title: `Use ${prefixes[msg.channel.guild.id]}help for commands`
        }});

    if (!msg.content.startsWith(prefixes[msg.channel.guild.id]) || !msg.channel.hasPermissions(client.user.id, 'sendMessages', 'embedLinks')) return;

    let command = msg.content.slice(prefixes[msg.channel.guild.id].length).toLowerCase().split(' ')[0];
    const args  = msg.content.split(' ').slice(1);
    console.log(`${msg.author.username} > ${msg.content}`);

    /* Extras */
    msg.channel.guild.prefix = prefixes[msg.channel.guild.id];

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