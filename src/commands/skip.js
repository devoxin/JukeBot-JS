exports.run = async function ({ client, msg }) {
  const audioPlayer = client.getAudioPlayer(msg.channel.guild.id);
  const voiceConnection = client.voiceConnections.get(msg.channel.guild.id);

  if (!audioPlayer.isPlaying()) {
    return msg.channel.createMessage({ embed: {
      color: client.config.options.embedColour,
      title: 'There\'s no playback activity'
    } });
  }

  if (msg.member.voiceState.channelID !== voiceConnection.channelID) {
    return msg.channel.createMessage({ embed: {
      color: client.config.options.embedColour,
      title: 'You need to be in my voicechannel to skip'
    } });
  }

  const votes = audioPlayer.voteSkip(msg.author.id);
  const requiredVotes = Math.round(client.getChannel(voiceConnection.channelID).voiceMembers.filter(m => !m.bot).length / 2);

  if (votes >= requiredVotes) {
    return audioPlayer.stop();
  }

  msg.channel.createMessage({ embed: {
    color: client.config.options.embedColour,
    title: 'Vote Skip',
    description: `${votes}/${requiredVotes} voted.`
  } });
};

exports.usage = {
  main: '{prefix}{command}',
  args: '',
  description: 'Vote skip the currently playing song'
};
