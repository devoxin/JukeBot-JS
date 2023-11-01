exports.run = async function ({ client, msg, args }) {
  if (!args[0]) {
    const commands = Array.from(client.commands.keys()).sort().join(', ');
    const aliases = Array.from(client.aliases.keys()).map(a => `${a.padEnd(10, ' ')}${client.aliases.get(a)}`).join('\n');

    msg.channel.createMessage({ embed: {
      color: client.config.options.embedColour,
      title: 'Help',
      description: commands,
      fields: [
        { name: 'Aliases', value: `\`\`\`\n${aliases}\n\`\`\``, inline: true },
        { name: 'Support', value: 'Need help with JukeBot? [Join Here!](https://discord.gg/xvtH2Yn)\n\n' +
                                          `View command info with \`${client.config.options.prefix}help <command>\``, inline: true }
      ]
    } });

  } else {
    if (client.commands.has(args[0])) {
      const cmd = client.commands.get(args[0]);

      msg.channel.createMessage({ embed: {
        color: client.config.options.embedColour,
        title: `Help for ${args[0].toLowerCase()}`,
        description: `Syntax: \`${client.config.options.prefix}${args[0].toLowerCase()} ${cmd.usage.args}\`\n\nDescription: ${cmd.usage.description}`
      } });
    } else {
      msg.channel.createMessage({ embed: {
        color: client.config.options.embedColour,
        title: 'Invalid command',
        description: 'Did you type the command correctly?'
      } });
    }
  }
};

exports.usage = {
  main: '{prefix}{command}',
  args: '[command]',
  description: 'Shows commands and aliases.'
};
