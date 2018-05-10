exports.run = async function ({ client, msg }) {
    const audioPlayer = client.getAudioPlayer(msg.channel.guild.id);

    if (!msg.member.isAdmin) {
        return msg.channel.createMessage({ embed: {
            color: client.config.options.embedColour,
            title: 'Insufficient Permissions',
        }});
    }

    if (!audioPlayer.isPlaying())
        return msg.channel.createMessage({ embed: {
            color: client.config.options.embedColour,
            title: 'There\'s no playback activity'
        }});

    if (audioPlayer.queue.length < 3)
        return msg.channel.createMessage({ embed: {
            color: client.config.options.embedColour,
            title: 'There\'s not enough songs in the queue to shuffle',
        }});

    let curInd = audioPlayer.queue.length, tempVal, randInd;

    while (curInd !== 0) {

        randInd = Math.floor(Math.random() * curInd);
        curInd--;
        tempVal = audioPlayer.queue[curInd];
        audioPlayer.queue[curInd] = audioPlayer.queue[randInd];
        audioPlayer.queue[randInd] = tempVal;

    }

    msg.channel.createMessage({ embed: {
        color: client.config.options.embedColour,
        title: 'Queue Shuffled.'
    }});
};

exports.usage = {
    main: '{prefix}{command}',
    args: '',
    description: 'Randomizes the queue'
};
