exports.run = async function({ client, msg, args }) {
    const audioPlayer = client.getAudioPlayer(msg.channel.guild.id);

    if (audioPlayer.queue.length === 0) {
        return msg.channel.createMessage({ embed: {
            color: client.config.options.embedColour,
            title: 'The queue is empty.'
        }});
    }

    const amount = Number(args[0]);

    if (!amount || amount <= 0) {
        return msg.channel.createMessage({ embed: {
            color: client.config.options.embedColour,
            title: 'You need to specify a number between 1 and 100'
        }});
    }

    const m = await msg.channel.createMessage({ embed: {
        color: client.config.options.embedColour,
        title: `Removing up to ${amount} songs queued by you...`
    }});

    let removed = 0;

    for (const track in audioPlayer.queue) {
        if (removed === amount) {
            break;
        }

        if (audioPlayer.queue[track].req === msg.author.id) {
            audioPlayer.queue.splice(track, 1);
            removed++;
        }
    }

    m.edit({ embed: {
        color: client.config.options.embedColour,
        title: `${removed} songs removed.`
    }});
};

exports.usage = {
    main: '{prefix}{command}',
    args: '<1-100>',
    description: 'Removes the last `x` songs from the queue'
};

exports.aliases = ['z'];
