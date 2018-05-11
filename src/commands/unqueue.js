exports.run = async function ({ client, msg, args }) {
    const audioPlayer = client.getAudioPlayer(msg.channel.guild.id);

    if (audioPlayer.queue.length === 0) {
        return msg.channel.createMessage({ embed: {
            color: client.config.options.embedColour,
            title: 'The queue is empty.'
        } });
    }

    const amount = Math.round(Number(args[0]) || 0);

    if (amount <= 0|| amount >= audioPlayer.queue.length) {
        return msg.channel.createMessage({ embed: {
            color: client.config.options.embedColour,
            title: `You need to specify a number higher than 0, and less than ${audioPlayer.queue.length}`
        } });
    }

    if (audioPlayer.queue[amount].req !== msg.author.id && !msg.member.isAdmin) {
        return msg.channel.createMessage({ embed: {
            color: client.config.options.embedColour,
            title: 'You can\'t unqueue that.'
        } });
    }

    msg.channel.createMessage({ embed: {
        color: client.config.options.embedColour,
        title: `Unqueued ${audioPlayer.queue[amount].title}`
    } });

    audioPlayer.queue.splice(amount, 1);
};

exports.usage = {
    main: '{prefix}{command}',
    args: '<index>',
    description: 'Unqueues the song at the specified position'
};

exports.aliases = ['uq'];
