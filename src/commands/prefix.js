exports.run = function (client, msg, args) {

    if (!msg.member.isAdmin)
        return msg.channel.createMessage({ embed: {
            color: config.options.embedColour,
            title: 'Insufficient Permissions',
        }});

    if (!args[0])
        return msg.channel.createMessage({ embed: {
            color: config.options.embedColour,
            title: 'Invalid prefix character'
        }});

    if (args[0].length > 15)
        return msg.channel.createMessage({ embed: {
            color: config.options.embedColour,
            title: 'The new prefix cannot exceed 15 characters',
        }});

    prefixes[msg.channel.guild.id] = args[0];

    msg.channel.createMessage({ embed: {
        color: config.options.embedColour,
        title: 'Prefix updated!'
    }});

};

exports.usage = {
    main: '{prefix}{command}',
    args: '<prefix>',
    description: 'Sets the prefix for this server'
};
