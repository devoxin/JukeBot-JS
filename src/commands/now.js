const timeParser = require('../../util/timeParser.js');

exports.run = async function ({ client, msg }) {
    const audioPlayer = client.getAudioPlayer(msg.channel.guild.id);

    if (!audioPlayer.isPlaying()) {
        return msg.channel.createMessage({ embed: {
            color: client.config.options.embedColour,
            title: 'There\'s nothing playing'
        }});
    }

    const track = audioPlayer.current;
    const { current } = client.voiceConnections.get(msg.channel.guild.id);

    const embed = {
        color: client.config.options.embedColour,
        title: 'Now Playing',
        description: `[${track.title}](${track.permalink})\n` +
            `${timeParser.formatSeconds(current.playTime / 1000)}/${timeParser.formatSeconds(track.duration / 1000)}`,
        footer: {
            text: `Requested by ${client.users.has(track.req) ? client.users.get(track.req).username : 'Unknown'}`
        }
    };

    msg.channel.createMessage({ embed });

};

exports.usage = {
    main: '{prefix}{command}',
    args: '',
    description: 'Shows info about the currently playing song'
};

exports.aliases = ['n'];
