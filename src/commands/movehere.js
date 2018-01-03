exports.run = function (client, msg, args) {

    if (!msg.member.isAdmin) return msg.channel.createMessage({ embed: {
        color: config.options.embedColour,
        title: 'Insufficient Permissions',
    }});

    if (client.voiceConnections.isConnected(msg.channel.guild.id)) return msg.channel.createMessage({ embed: {
        color: config.options.embedColour,
        title: 'Not Connected',
        description: 'I\'m not connected to any voicechannels'
    }});

    if (!msg.member.voiceState.channelID) return msg.channel.createMessage({ embed: {
        color: config.options.embedColour,
        title: 'You need to be in a voicechannel.'
    }});

    if (!client.getChannel(msg.member.voiceState.channelID).hasPermissions(client.user.id, 'voiceConnect', 'voiceSpeak'))
        return msg.channel.createMessage({ embed: {
            color: config.options.embedColour,
            title: 'Unable to Connect',
            description: 'This channel doesn\'t allow me to connect/speak.'
        }});

    client.voiceConnections.get(msg.channel.guild.id).switchChannel(msg.member.voiceState.channelID);

};

exports.usage = {
    main: '{prefix}{command}',
    args: '',
    description: 'Moves the bot to the sender\'s voicechannel'
};
