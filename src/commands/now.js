const timeParser = require('../../util/timeParser.js');

exports.run = function (client, msg) {

    if (guilds[msg.channel.guild.id].queue.length === 0)
        return msg.channel.createMessage({ embed: {
            color: config.options.embedColour,
            title: 'There\'s nothing playing'
        }});

    const guild = guilds[msg.channel.guild.id];
    const track = guild.queue[0];

    const embed = {
        color       : config.options.embedColour,
        title       : track.title,
        url         : track.permalink,
        description : `${timeParser.formatSeconds(client.voiceConnections.get(msg.channel.guild.id).current.playTime / 1000)}/${timeParser.formatSeconds(track.duration / 1000)}`,
        footer: {
            text: `Requested by ${client.users.get(track.req) ? client.users.get(track.req).username : 'Unknown'}`
        }
    };

    msg.channel.createMessage({ embed });

};

exports.usage = {
    main: '{prefix}{command}',
    args: '',
    description: 'Shows info about the currently playing song'
};
