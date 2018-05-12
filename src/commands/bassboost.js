exports.run = async function ({ client, msg, args }) {
    const audioPlayer = client.getAudioPlayer(msg.channel.guild.id);
    const voiceConnection = client.voiceConnections.get(msg.channel.guild.id);

    if (audioPlayer.isPlaying() && msg.member.voiceState.channelID !== voiceConnection.channelID) {
        return msg.channel.createMessage({ embed: {
            color: client.config.options.embedColour,
            title: 'You need to be in my voicechannel to set bass boost.'
        } });
    }

    if (!args[0] || !Number(args[0])) {
        return msg.channel.createMessage({
            embed: {
                color: client.config.options.embedColour,
                title: 'Bass Boost',
                description: `You need to specify how many dB to boost bass by.`
            }
        });
    }

    audioPlayer.setBassBoost(Number(args[0]));

    msg.channel.createMessage({ embed: {
        color: client.config.options.embedColour,
        title: 'Bass Boost',
        description: `Bass boost will be applied on the next song.`
    } });
};

exports.usage = {
    main: '{prefix}{command}',
    args: '',
    description: 'Bass boosts the music'
};
