exports.run = async function ({ client, msg, args }) {
    const audioPlayer = client.getAudioPlayer(msg.channel.guild.id);

    const dmc = await msg.author.getDMChannel()
        .catch(() => null);

    if (!dmc) {
        return msg.channel.createMessage({ embed: {
            color: client.config.options.embedColour,
            title: 'There was an error fetching a DM channel.'
        } });
    }

    if (args[0] === '-q') {
        if (audioPlayer.queue.length === 0) {
            return msg.channel.createMessage({ embed: {
                color: client.config.options.embedColour,
                title: 'Nothing is queued.'
            } });
        }

        const m = await msg.channel.createMessage({ embed: {
            color: client.config.options.embedColour,
            title: 'Compiling queue...'
        } });

        const queue = audioPlayer.queue.map(s => `${s.title} (${s.permalink})`).join('\r\n');

        dmc.createMessage({
            name: 'queue.txt',
            file: Buffer.from(queue, 'utf8')
        })
            .catch(err => {
                m.edit({ embed: {
                    color: client.config.options.embedColour,
                    title: err.message
                } });
            });
    } else {
        const song = audioPlayer.current;

        if (!song) {
            return msg.channel.createMessage({ embed: {
                color: client.config.options.embedColour,
                title: 'Nothing playing.'
            } });
        }

        dmc.createMessage({ embed: {
            color: client.config.options.embedColour,
            title: song.title,
            url  : song.permalink
        } });
    }
};

exports.usage = {
    main: '{prefix}{command}',
    args: '[-q]',
    description: 'DMs you info about the currently playing song (or queue, if \'-q\' is specified)'
};
