const timeParser = require('../../util/timeParser.js');

exports.run = function (client, msg, args) {

    if (guilds[msg.channel.guild.id].queue.length <= 1)
        return msg.channel.createMessage({ embed: {
            color: config.options.embedColour,
            title: 'There\'s nothing queued'
        }});


    const guild = guilds[msg.channel.guild.id];

    let page = parseInt(args[0]) ? parseInt(args[0]) : 1;
    const maxPage = Math.ceil(guild.queue.slice(1).length / 10);

    if (page < 1)       page = 1;
    if (page > maxPage) page = maxPage;

    const startQueue = (page - 1) * 10 + 1;
    const endQueue   = startQueue + 10 > guild.queue.length ? guild.queue.length : startQueue + 10;

    const track = guild.queue[0];

    const embed = {
        color       : config.options.embedColour,
        title       : track.title,
        url         : track.src !== 'soundcloud' ? `https://youtu.be/${track.id}` : undefined,
        description : `${timeParser.formatSeconds(client.voiceConnections.get(msg.channel.guild.id).current.playTime / 1000)}${track.src === 'youtube' ? `/${  timeParser.formatSeconds(track.duration)}` : ''}`,
        fields: [
            {
                name: 'Queue',
                value: guild.queue.slice(startQueue, endQueue).map((item, i) => `${startQueue + i}. ${item.title} - ${client.users.get(item.req) ? client.users.get(item.req).username : 'Unknown'}`).join('\n')
            }
        ],
        footer: {
            text: `Page ${page}/${maxPage}`
        }
    };

    msg.channel.createMessage({ embed: embed }).catch(e => {});

};

exports.usage = {
    main: '{prefix}{command}',
    args: '<page number>',
    description: 'View the specified queue page'
};
