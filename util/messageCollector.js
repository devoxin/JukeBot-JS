const EventEmitter = require('eventemitter3');

class MessageCollector extends EventEmitter {
    constructor(client, channel, filter, options = {}) {
        super();
        this.filter = filter;
        this.channel = channel;
        this.options = options;
        this.client = client;
        this.ended = false;
        this.collected = [];

        this.listener = message => this.verify(message);
        client.on('messageCreate', this.listener);
        if(options.time) setTimeout(() => this.stop('time'), options.time);
    }

    verify(message) {
        if(this.channel.id !== message.channel.id) return false;
        if(this.filter(message)) {
            this.collected.push(message);

            this.emit('message', message);
            if(this.collected.length >= this.options.maxMatches) this.stop('maxMatches');
            return true;
        }
        return false;
    }

    stop(reason) {
        if(this.ended) return;
        this.ended = true;
        this.client.removeListener('messageCreate', this.listener);

        this.emit('end', this.collected, reason);
    }
}

module.exports = {
    MessageCollector: MessageCollector,
    awaitMessages: (client, channel, filter, options) => {
        let collector = new MessageCollector(client, channel, filter, options);
        return new Promise((resolve, reject) => {
            collector.on('end', (collected, reason) => {
                resolve(collected, reason);
            });
        });
    }
};
