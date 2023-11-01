exports.run = async function ({ client, msg }) {
  const audioPlayer = client.getAudioPlayer(msg.channel.guild.id);

  if (!msg.member.isAdmin) {
    return msg.channel.createMessage({ embed: {
      color: client.config.options.embedColour,
      title: 'Insufficient Permissions',
    } });
  }

  if (!audioPlayer.isPlaying()) {
    return msg.channel.createMessage({ embed: {
      color: client.config.options.embedColour,
      title: 'There\'s no playback activity.'
    } });
  }

  client.voiceConnections.get(msg.channel.guild.id).pause();

};

exports.usage = {
  main: '{prefix}{command}',
  args: '',
  description: 'Pause playback'
};

exports.aliases = ['ps'];
