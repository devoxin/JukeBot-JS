exports.run = async function ({ client, msg, args }) {
    const audioPlayer = client.getAudioPlayer(msg.channel.guild.id);

    if (!msg.member.isAdmin) {
        return msg.channel.createMessage({ embed: {
            color: client.config.options.embedColour,
            title: 'Insufficient Permissions',
        }});
    }

    switch (args[0]) {
        case 'a':
        case 'all':
            audioPlayer.setRepeat(2);
            break;
        case 'c':
        case 'current':
            audioPlayer.setRepeat(1);
            break;
        case 'n':
        case 'none':
            audioPlayer.setRepeat(0);
            break;
        default:
            return msg.channel.createMessage({ embed: {
                color: client.config.options.embedColour,
                title: `Repeat mode: ${audioPlayer.getRepeatReadable()}`,
                description: `${client.config.options.prefix}repeat < a | c | n >\n\n[All, Current, None]`
            }});
    }

    msg.channel.createMessage({ embed: {
        color: client.config.options.embedColour,
        title: 'Repeat Toggled',
        description: `Repeating ${audioPlayer.getRepeatReadable()}`
    }});

};

exports.usage = {
    main: '{prefix}{command}',
    args: '<all|current|none>',
    description: 'Toggles the repeat mode'
};
