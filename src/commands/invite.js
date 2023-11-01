exports.run = async function ({ client, msg }) {

  msg.channel.createMessage({ embed: {
    color: client.config.options.embedColour,
    fields: [
      { name: 'Add me to your server!',  value: '[Click Here](http://bit.ly/2oBEE0Q)',      inline: true },
      { name: 'Join my support server!', value: '[Click Here](https://discord.gg/xvtH2Yn)', inline: true }
    ]
  } });

};

exports.usage = {
  main: '{prefix}{command}',
  args: '',
  description: 'Shows server and bot invite links'
};
