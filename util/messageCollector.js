class MessageCollector {
    constructor (client) {
        this.collectors = [];
        client.on('messageCreate', this.check.bind(this));
    }

    awaitMessages (channelId, check, timeout = null) {
        return new Promise(accept => {
            this.collectors.push({ channelId, check, accept });
            if (timeout) {
                setTimeout(accept, timeout);
            }
        });
    }

    check (message) {
        const _collectors = this.collectors.filter(c => c.channelId === message.channel.id);

        for (const collector of _collectors) {
            if (collector.check(message)) {
                collector.accept(message);
                this.collectors.splice(this.collectors.indexOf(collector), 1);
            }
        }
    }
}

module.exports = MessageCollector;
