const timeParser = require('../../util/timeParser.js');

exports.run = async function ({ client, msg, args }) {
    const audioPlayer = client.getAudioPlayer(msg.channel.guild.id);

    if (audioPlayer.queue.length === 0) {
        return msg.channel.createMessage({ embed: {
            color: client.config.options.embedColour,
            title: 'The queue is empty'
        } });
    }

    const maxPage = Math.ceil(audioPlayer.queue.length / 10);
    const page = Math.max(Math.min(Number(args[0]) || 1, maxPage), 1);

    const startQueue = (page - 1) * 10;
    const endQueue   = startQueue + 10 > audioPlayer.queue.length ? audioPlayer.queue.length : startQueue + 10;

    const track = audioPlayer.current;
    const { current } = client.voiceConnections.get(msg.channel.guild.id);

    const embed = {
        color       : client.config.options.embedColour,
        title       : track.title,
        url         : track.permalink,
        description : `${timeParser.formatSeconds(current.playTime / 1000)}/${timeParser.formatSeconds(track.duration / 1000)}`,
        fields: [
            {
                name: 'Queue',
                value: audioPlayer.queue.slice(startQueue, endQueue).map((item, i) => `${startQueue + i + 1}. ${item.title} - ${client.users.has(item.req) ? client.users.get(item.req).username : 'Unknown'}`).join('\n')
            }
        ],
        footer: {
            text: `Page ${page}/${maxPage}`
        }
    };

    msg.channel.createMessage({ embed });
};

exports.usage = {
    main: '{prefix}{command}',
    args: '<page>',
    description: 'View the specified queue page'
};

exports.aliases = ['q'];
