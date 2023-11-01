const timeParser  = require('../../util/timeParser.js');
const { version } = require('../../package.json');

exports.run = async function ({ client, msg }) {
  const playing = client.voiceConnections.filter(vc => vc.playing).length;
  const paused  = client.voiceConnections.size - playing;

  msg.channel.createMessage({ embed: {
    color: client.config.options.embedColour,
    title: `JukeBot v${version}`,
    description: 'Created by Kromatic#0420',
    fields: [
      { name: 'Uptime',		  value: timeParser.formatSeconds(process.uptime()),						inline: true },
      { name: 'RAM Usage',	  value: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,      inline: true },
      { name: 'Library',		  value: 'Eris',															inline: true },
      { name: 'Streams',        value: `► ${playing}, ❚❚ ${paused}`,                                      inline: true },
      { name: 'Servers',		  value: client.guilds.size,												inline: true },
      { name: 'Latency',		  value: `${msg.channel.guild.shard.latency}ms`,							inline: true }
    ]
  } });

};

exports.usage = {
  main: '{prefix}{command}',
  args: '',
  description: 'View statistics of the bot'
};
