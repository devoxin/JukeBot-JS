const loadExtensions = require('./extensionLoader.js');
const audioPlayer = require('./audioPlayer.js');
const messageCollector = require('./messageCollector.js');
const extras = require('./extras.js');
const fs = require('fs');
const Eris = loadExtensions(require('eris'));
const { Client } = Eris;


class Bot extends Client {
    constructor (config, clientOptions) {
        if (Array.isArray(clientOptions.disableEvents)) {
            clientOptions.disableEvents = extras.disable(clientOptions.disableEvents);
        }

        super(config.keys.discord, clientOptions);

        this.config = config;
        this.audioPlayers = new Map();
        this.commands = new Map();
        this.aliases = new Map();
        this.messageCollector = new messageCollector(this);

        this._loadCommands();
    }

    _loadCommands () {
        fs.readdir(`${process.cwd()}/commands/`, (err, files) => {
            if (err) {
                return this.log('ERROR', 'Unable to index "commands"', err);
            }

            files.forEach(file => {
                try {
                    const command = require(`${process.cwd()}/commands/${file}`);
                    const name = file.replace('.js', '').toLowerCase();
                    this.commands.set(name, command);

                    if (command.aliases) {
                        for (const alias of command.aliases) {
                            this.aliases.set(alias, name);
                        }
                    }
                } catch(e) {
                    this.log('ERROR', `Failed to load command "${file}"`, e);
                }
            });
        });
    }

    getAudioPlayer (guildId) {
        if (!this.audioPlayers.has(guildId)) {
            this.audioPlayers.set(guildId, new audioPlayer(this, guildId));
        }

        return this.audioPlayers.get(guildId);
    }

    log (logLevel, content, ...extras) {
        const time = new Date();
        const timestamp = `${time.toDateString()} ${time.toLocaleTimeString()}`;
        console.log(`[${timestamp}] [${logLevel.padEnd(5, ' ')}] ${content}${extras.join('\n\t').trim()}`); // eslint-disable-line
    }

    async awaitMessage (channelId, check, timeout) {
        const result = await this.messageCollector.awaitMessages(channelId, check, timeout);
        return result;
    }
}

module.exports = Bot;
