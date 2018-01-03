exports.run = function (client, msg, args) {

    if (!msg.member.isAdmin) return msg.channel.createMessage({ embed: {
        color: config.options.embedColour,
        title: 'Insufficient Permissions',
    }});

    if (!client.voiceConnections.get(msg.channel.guild.id) || guilds[msg.channel.guild.id].queue.length === 0) return msg.channel.createMessage({ embed: {
        color: config.options.embedColour,
        title: 'There\'s no playback activity.'
    }});

    client.voiceConnections.get(msg.channel.guild.id).pause();

};

exports.usage = {
    main: '{prefix}{command}',
    args: '',
    description: 'Pause playback'
};
