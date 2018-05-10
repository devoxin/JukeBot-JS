exports.run = async function ({ client, msg }) {
    const audioPlayer = client.getAudioPlayer(msg.channel.guild.id);

    if (!audioPlayer.isPlaying()) {
        return msg.channel.createMessage({ embed: {
            color: client.config.options.embedColour,
            title: 'There\'s no playback activity.'
        }});
    }

    if (!msg.member.isAdmin && audioPlayer.currentlyPlaying.req !== msg.author.id) {
        return msg.channel.createMessage({ embed: {
            color: client.config.options.embedColour,
            title: 'Insufficient Permissions',
        }});
    }

    audioPlayer.stop();
};

exports.usage = {
    main: '{prefix}{command}',
    args: '',
    description: 'Skips the current song by force (no voting)'
};

exports.aliases = ['fs'];
