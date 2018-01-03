const ytutil = require('../util/youtubeHandler.js');

exports.play = async function play(guild, client) {
    if (!client.guilds.has(guild.id) ||	!client.voiceConnections.isConnected(guild.id) || client.voiceConnections.get(guild.id).playing || client.voiceConnections.get(guild.id).paused) return;

    if (guild.queue.length === 0) {
        if (client.voiceConnections.isConnected(guild.id)) client.leaveVoiceChannel(guild.id);
        return client.getChannel(guild.msgc).createMessage({ embed: {
            color: config.options.embedColour,
            title: 'Queue concluded!',
            description: 'Why not queue more songs?'
        }});
    }

    const trackURL = guild.queue[0].src === 'youtube'
        ? await ytutil.getFormats(guild.queue[0].id)
        : guild.queue[0].id;

    if (guild.queue[0].src === 'youtube') {
        const duration = await ytutil.getDuration(guild.queue[0].id);
        guild.queue[0].duration = duration;
    }

    if (!trackURL) {
        guild.queue.shift();
        client.getChannel(guild.msgc).createMessage({ embed: {
            color: config.options.embedColour,
            title: `**${guild.queue[0].title}** is unplayable, skipping...`
        }});
        return exports.play(guild, client);
    }

    client.getChannel(guild.msgc).createMessage({embed: {
        color: config.options.embedColour,
        title: 'Now Playing',
        description: `${guild.queue[0].title}` //(https://youtu.be/${guild.queue[0].id})`
    }});

    client.voiceConnections.get(guild.id).play(trackURL);

    client.voiceConnections.get(guild.id).once('end', () => {
        if (guild.repeat === 'All') guild.queue.push(guild.queue[0]);
        if (guild.repeat !== 'Current') guild.queue.shift();
        guild.svotes = [];
        exports.play(guild, client);
    });

};
